import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://guvsxxrvcozeiwagcstn.supabase.co';
const supabaseAnonKey = 'sb_publishable_Qa49C1l9b1iPStLkgogCCA_x3YmLaes';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data: books } = await supabase.from('books').select('id, title');
  for (const book of books) {
    let cover = null;
    if (book.title.includes('Sommer')) cover = '/covers/sommer.png';
    else if (book.title.includes('Neuanfang') || book.title.includes('Wien')) cover = '/covers/neuanfang.png';

    if (cover) {
      await supabase.from('books').update({ cover_url: cover }).eq('id', book.id);
      console.log(`Updated ${book.title} with ${cover}`);
    }
  }
}
main();
