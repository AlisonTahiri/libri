/**
 * epubParser.ts
 *
 * Parses an .epub file (ZIP archive) and extracts:
 *  - Book metadata (title, author)
 *  - Cover image (base64)
 *  - Chapters as sanitized HTML strings (images stripped)
 *
 * No epub.js needed — pure JSZip + DOM parsing.
 */

import JSZip from 'jszip';
import DOMPurify from 'dompurify';

export interface ParsedChapter {
  orderIndex: number;
  title: string;
  htmlContent: string;
}

export interface ParsedEpub {
  title: string;
  author: string;
  coverImageBase64?: string;
  chapters: ParsedChapter[];
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Resolve a path like "OEBPS/../images/cover.jpg" relative to a base path */
function resolvePath(base: string, relative: string): string {
  const baseParts = base.split('/');
  baseParts.pop(); // Remove filename, keep directory
  const relativeParts = relative.split('/');
  for (const part of relativeParts) {
    if (part === '..') {
      baseParts.pop();
    } else if (part !== '.') {
      baseParts.push(part);
    }
  }
  return baseParts.join('/');
}

/** Strip images and inline styles from an HTML string, return clean text HTML and extracted heading */
function cleanHtml(rawHtml: string, formattingClasses?: { bold: Set<string>, italic: Set<string>, underline: Set<string> }): { html: string; heading: string | null } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // Try to find the first semantic heading
  let heading = doc.querySelector('h1, h2, h3')?.textContent?.trim() || null;
  
  // Convert formatting classes to semantic tags before stripping classes
  if (formattingClasses) {
    const { bold, italic, underline } = formattingClasses;
    // Process bottom-up to avoid invalidating child node references when changing innerHTML
    const elements = Array.from(doc.querySelectorAll('*[class]')).reverse();
    for (const el of elements) {
      const classAttr = el.getAttribute('class');
      if (classAttr) {
        const classes = classAttr.split(/\s+/);
        let isBold = false, isItalic = false, isUnderline = false;
        for (const c of classes) {
          if (bold.has(c)) isBold = true;
          if (italic.has(c)) isItalic = true;
          if (underline.has(c)) isUnderline = true;
        }
        
        if (isBold || isItalic || isUnderline) {
          let innerHtml = el.innerHTML;
          if (isBold) innerHtml = `<b>${innerHtml}</b>`;
          if (isItalic) innerHtml = `<i>${innerHtml}</i>`;
          if (isUnderline) innerHtml = `<u>${innerHtml}</u>`;
          el.innerHTML = innerHtml;
        }
      }
    }
  }

  // Remove images, audio, video, script, style elements
  doc.querySelectorAll('img, image, audio, video, script, style, svg').forEach(el => el.remove());

  // Strip inline style attributes but keep semantic tags
  doc.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
  doc.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));
  doc.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

  // Get the body content
  const body = doc.body;
  if (!body) return { html: '', heading: null };

  // Sanitize with DOMPurify
  const clean = DOMPurify.sanitize(body.innerHTML, {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr',
                   'em', 'strong', 'i', 'b', 'u', 'span', 'div', 'blockquote',
                   'ul', 'ol', 'li', 'a', 'sup', 'sub'],
    ALLOWED_ATTR: ['href'],
  });

  return { html: clean, heading };
}

// ─────────────────────────────────────────────
// Main parser
// ─────────────────────────────────────────────

export async function parseEpub(file: File): Promise<ParsedEpub> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());

  // ── 1. Find container.xml to locate the OPF file ──
  const containerXml = await zip.file('META-INF/container.xml')?.async('text');
  if (!containerXml) throw new Error('Invalid EPUB: no META-INF/container.xml');

  const containerDoc = new DOMParser().parseFromString(containerXml, 'text/xml');
  const opfPath = containerDoc
    .querySelector('rootfile')
    ?.getAttribute('full-path');
  if (!opfPath) throw new Error('Invalid EPUB: no rootfile in container.xml');

  // ── 2. Parse OPF (the manifest + spine) ──
  const opfXml = await zip.file(opfPath)?.async('text');
  if (!opfXml) throw new Error(`Invalid EPUB: cannot read OPF at ${opfPath}`);

  const opfDoc = new DOMParser().parseFromString(opfXml, 'text/xml');

  // Metadata
  const title = opfDoc.querySelector('metadata > *[id="title"], metadata title')?.textContent?.trim() ?? 'Unknown Title';
  const author = opfDoc.querySelector('metadata > *[id="creator"], metadata creator')?.textContent?.trim() ?? '';

  // Build manifest map: id → { href, mediaType }
  const manifestMap = new Map<string, { href: string; mediaType: string }>();
  opfDoc.querySelectorAll('manifest item').forEach(item => {
    const id = item.getAttribute('id');
    const href = item.getAttribute('href');
    const mediaType = item.getAttribute('media-type') ?? '';
    if (id && href) {
      manifestMap.set(id, { href: resolvePath(opfPath, href), mediaType });
    }
  });

  // Cover image
  let coverImageBase64: string | undefined;
  const coverMeta = opfDoc.querySelector('metadata meta[name="cover"]');
  const coverId = coverMeta?.getAttribute('content');
  if (coverId && manifestMap.has(coverId)) {
    const coverEntry = manifestMap.get(coverId)!;
    const coverFile = zip.file(coverEntry.href);
    if (coverFile) {
      try {
        const coverBytes = await coverFile.async('base64');
        const mt = coverEntry.mediaType || 'image/jpeg';
        coverImageBase64 = `data:${mt};base64,${coverBytes}`;
      } catch (_) { /* ignore cover errors */ }
    }
  }

  // Spine: ordered list of manifest item ids
  const spineItemRefs = Array.from(opfDoc.querySelectorAll('spine itemref'))
    .map(ref => ref.getAttribute('idref'))
    .filter(Boolean) as string[];

  // ── 3. Extract TOC titles (NCX or nav) ──
  const tocTitles = new Map<string, string>(); // href → title

  // Try NCX first (EPUB 2)
  const ncxId = opfDoc.querySelector('spine')?.getAttribute('toc');
  const ncxEntry = ncxId ? manifestMap.get(ncxId) : null;
  if (ncxEntry) {
    const ncxXml = await zip.file(ncxEntry.href)?.async('text');
    if (ncxXml) {
      const ncxDoc = new DOMParser().parseFromString(ncxXml, 'text/xml');
      ncxDoc.querySelectorAll('navPoint').forEach(np => {
        const label = np.querySelector('navLabel text')?.textContent?.trim() ?? '';
        const contentSrc = np.querySelector('content')?.getAttribute('src');
        if (contentSrc) {
          const resolved = resolvePath(ncxEntry.href, contentSrc.split('#')[0]);
          if (!tocTitles.has(resolved)) {
            tocTitles.set(resolved, label);
          }
        }
      });
    }
  }

  // Try EPUB3 nav document as fallback
  const navEntry = Array.from(manifestMap.values()).find(
    m => m.mediaType === 'application/xhtml+xml' && m.href.includes('nav')
  );
  if (navEntry && tocTitles.size === 0) {
    const navHtml = await zip.file(navEntry.href)?.async('text');
    if (navHtml) {
      const navDoc = new DOMParser().parseFromString(navHtml, 'text/html');
      navDoc.querySelectorAll('nav[epub\\:type="toc"] a, nav a').forEach(a => {
        const href = (a as HTMLAnchorElement).getAttribute('href');
        const label = a.textContent?.trim() ?? '';
        if (href) {
          const resolved = resolvePath(navEntry.href, href.split('#')[0]);
          if (!tocTitles.has(resolved)) {
            tocTitles.set(resolved, label);
          }
        }
      });
    }
  }
  
  // ── 3.5 Parse CSS for formatting classes ──
  const formattingClasses = {
    bold: new Set<string>(),
    italic: new Set<string>(),
    underline: new Set<string>(),
  };

  for (const entry of Array.from(manifestMap.values())) {
    if (entry.mediaType === 'text/css') {
      const cssText = await zip.file(entry.href)?.async('text');
      if (cssText) {
        // Find class blocks like: .className { ... font-weight: bold ... }
        const rules = cssText.match(/\.[^{]+\{[^}]+\}/g) || [];
        for (const rule of rules) {
          // match multiple classes separated by comma: .span1, .span2 { ... }
          const match = rule.match(/((?:\.[a-zA-Z0-9_-]+(?:\s*,\s*)?)+)\s*\{([^}]+)\}/);
          if (match) {
            const selectors = match[1].split(',').map(s => s.trim().replace('.', ''));
            const styles = match[2];
            
            const isBold = /font-weight\s*:\s*(bold|[789]00)/i.test(styles);
            const isItalic = /font-style\s*:\s*italic/i.test(styles);
            const isUnderline = /text-decoration\s*:\s*underline/i.test(styles);
            
            for (const className of selectors) {
              if (isBold) formattingClasses.bold.add(className);
              if (isItalic) formattingClasses.italic.add(className);
              if (isUnderline) formattingClasses.underline.add(className);
            }
          }
        }
      }
    }
  }

  // ── 4. Extract each spine chapter as clean HTML ──
  const chapters: ParsedChapter[] = [];

  for (let i = 0; i < spineItemRefs.length; i++) {
    const idref = spineItemRefs[i];
    const entry = manifestMap.get(idref);
    if (!entry) continue;
    if (!entry.mediaType.includes('html') && !entry.mediaType.includes('xml')) continue;

    const rawHtml = await zip.file(entry.href)?.async('text');
    if (!rawHtml) continue;

    let { html, heading } = cleanHtml(rawHtml, formattingClasses);
    html = html.replace(/<p>\s*<\/p>/g, '');

    // Skip chapters with essentially no text content
    const textLength = html.replace(/<[^>]+>/g, '').trim().length;
    if (textLength < 20) continue;

    // Prefer the HTML heading, fallback to TOC, then fallback to Kapitulli X
    let chapterTitle = heading || tocTitles.get(entry.href) || `Kapitulli ${chapters.length + 1}`;

    // Clean up excessive whitespace in title
    chapterTitle = chapterTitle.replace(/\s+/g, ' ').trim();

    chapters.push({
      orderIndex: chapters.length,
      title: chapterTitle,
      htmlContent: html,
    });
  }

  if (chapters.length === 0) {
    throw new Error('EPUB nuk ka kapituj me tekst.');
  }

  return { title, author, coverImageBase64, chapters };
}
