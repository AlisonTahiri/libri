-- ═══════════════════════════════════════════════════════
-- LIBRI — Neuanfang in Wien (Zgjeruar)
-- Nivel: B1 | Gjermanisht → Shqip
-- ═══════════════════════════════════════════════════════

-- Fshi librin nëse ekziston
DELETE FROM public.books WHERE title = 'Neuanfang in Wien';

-- Libri
INSERT INTO public.books (id, title, author, source_language, target_language, total_chapters)
VALUES (
  'b0010000-0000-0000-0000-000000000000',
  'Neuanfang in Wien',
  'Libri Originals',
  'de',
  'sq',
  7
);

-- Kapitujt
INSERT INTO public.chapters (id, book_id, chapter_number, title) VALUES
('c0010001-0000-0000-0000-000000000000', 'b0010000-0000-0000-0000-000000000000', 1, 'Die Ankunft am Bahnhof'),
('c0010002-0000-0000-0000-000000000000', 'b0010000-0000-0000-0000-000000000000', 2, 'Die erste Vorlesung'),
('c0010003-0000-0000-0000-000000000000', 'b0010000-0000-0000-0000-000000000000', 3, 'Heimweh und neue Freunde'),
('c0010004-0000-0000-0000-000000000000', 'b0010000-0000-0000-0000-000000000000', 4, 'Die WG-Suche'),
('c0010005-0000-0000-0000-000000000000', 'b0010000-0000-0000-0000-000000000000', 5, 'Der Nebenjob im Café'),
('c0010006-0000-0000-0000-000000000000', 'b0010000-0000-0000-0000-000000000000', 6, 'Ein Ausflug in die Berge'),
('c0010007-0000-0000-0000-000000000000', 'b0010000-0000-0000-0000-000000000000', 7, 'Das erste Semesterende');

-- ═══════════════════════════════════════════════════════
-- Kapitulli 1: Die Ankunft am Bahnhof
-- ═══════════════════════════════════════════════════════
INSERT INTO public.paragraphs (id, chapter_id, order_index) VALUES
('a0010001-0001-0000-0000-000000000000', 'c0010001-0000-0000-0000-000000000000', 0),
('a0010001-0002-0000-0000-000000000000', 'c0010001-0000-0000-0000-000000000000', 1),
('a0010001-0003-0000-0000-000000000000', 'c0010001-0000-0000-0000-000000000000', 2),
('a0010001-0004-0000-0000-000000000000', 'c0010001-0000-0000-0000-000000000000', 3),
('a0010001-0005-0000-0000-000000000000', 'c0010001-0000-0000-0000-000000000000', 4),
('a0010001-0006-0000-0000-000000000000', 'c0010001-0000-0000-0000-000000000000', 5);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text) VALUES
('a0010001-0001-0000-0000-000000000000', 0, 'Als der Zug endlich am Wiener Hauptbahnhof ankam, war Agron erschöpft, aber glücklich.', 'Kur treni mbërriti më në fund në Stacionin Qendror të Vjenës, Agroni ishte i rraskapitur, por i lumtur.'),
('a0010001-0001-0000-0000-000000000000', 1, 'Er hatte eine lange Reise aus Tirana hinter sich, die fast den ganzen Tag gedauert hatte.', 'Ai kishte kaluar një udhëtim të gjatë nga Tirana, i cili kishte zgjatur pothuajse gjithë ditën.'),
('a0010001-0001-0000-0000-000000000000', 2, 'Obwohl er schon viel über Wien gelesen hatte, war die Realität noch beeindruckender.', 'Ndonëse kishte lexuar shumë për Vjenën, realiteti ishte edhe më mbresëlënës.'),

('a0010001-0002-0000-0000-000000000000', 0, 'Er nahm seinen schweren Koffer und stieg aus dem Zug.', 'Ai mori valixhen e tij të rëndë dhe zbriti nga treni.'),
('a0010001-0002-0000-0000-000000000000', 1, 'Die Luft war kühl und die vielen Menschen eilten in alle Richtungen.', 'Ajri ishte i ftohtë dhe njerëzit e shumtë nxitonin në të gjitha drejtimet.'),
('a0010001-0002-0000-0000-000000000000', 2, 'Zuerst musste er herausfinden, wie man eine Fahrkarte für die U-Bahn kauft.', 'Në fillim atij iu desh të zbulonte se si blihet një biletë për metronë.'),

('a0010001-0003-0000-0000-000000000000', 0, 'An einem Fahrkartenautomaten stand eine junge Frau, die er höflich auf Deutsch um Hilfe bat.', 'Në një automat biletash qëndronte një grua e re, të cilës ai i kërkoi ndihmë me mirësjellje në gjermanisht.'),
('a0010001-0003-0000-0000-000000000000', 1, '„Entschuldigung, könnten Sie mir bitte zeigen, wie ich ein Ticket nach Favoriten bekomme?“, fragte er nervös.', '„Më falni, a mund të më tregoni ju lutem, se si të marr një biletë për në Favoriten?“, pyeti ai me nervozizëm.'),
('a0010001-0003-0000-0000-000000000000', 2, 'Die Frau lächelte freundlich und erklärte ihm, dass er einfach eine Einzelfahrkarte für die Stadtzone brauche.', 'Gruaja buzëqeshi miqësisht dhe i shpjegoi se atij i duhej thjesht një biletë e vetme për zonën e qytetit.'),

('a0010001-0004-0000-0000-000000000000', 0, 'Agron bedankte sich und kaufte das Ticket, das zwei Euro und vierzig Cent kostete.', 'Agroni e falënderoi dhe bleu biletën, e cila kushtonte dy euro e dyzet cent.'),
('a0010001-0004-0000-0000-000000000000', 1, 'Er war erleichtert, weil er sie ohne Probleme verstanden hatte.', 'Agroni u lehtësua, sepse ai e kishte kuptuar atë pa probleme.'),
('a0010001-0004-0000-0000-000000000000', 2, 'Mit dem Ticket in der Hand suchte er den Weg zur U-Bahn-Linie U1.', 'Me biletën në dorë, ai kërkoi rrugën për te linja e metrosë U1.'),

('a0010001-0005-0000-0000-000000000000', 0, 'Die U-Bahn-Station war sehr sauber und gut beleuchtet.', 'Stacioni i metrosë ishte shumë i pastër dhe i ndriçuar mirë.'),
('a0010001-0005-0000-0000-000000000000', 1, 'Nach wenigen Minuten kam ein roter Zug angebraust.', 'Pas pak minutash erdhi me vrull një tren i kuq.'),
('a0010001-0005-0000-0000-000000000000', 2, 'Er stieg ein und setzte sich neben das Fenster, um die Stadt zu beobachten.', 'Ai hipi dhe u ul pranë dritares, për të vëzhguar qytetin.'),

('a0010001-0006-0000-0000-000000000000', 0, 'Die Fahrt zu seinem Studentenwohnheim dauerte nicht lange.', 'Udhëtimi drejt konviktit të tij studentor nuk zgjati shumë.'),
('a0010001-0006-0000-0000-000000000000', 1, 'Als er endlich vor dem großen Gebäude stand, atmete er tief durch.', 'Kur ai më në fund qëndroi para ndërtesës së madhe, mori frymë thellë.'),
('a0010001-0006-0000-0000-000000000000', 2, 'Das war der Beginn seines neuen Lebenszeugnisses in Österreich.', 'Ky ishte fillimi i dëshmisë së jetës së tij të re në Austri.');

-- ═══════════════════════════════════════════════════════
-- Kapitulli 2: Die erste Vorlesung
-- ═══════════════════════════════════════════════════════
INSERT INTO public.paragraphs (id, chapter_id, order_index) VALUES
('a0010002-0001-0000-0000-000000000000', 'c0010002-0000-0000-0000-000000000000', 0),
('a0010002-0002-0000-0000-000000000000', 'c0010002-0000-0000-0000-000000000000', 1),
('a0010002-0003-0000-0000-000000000000', 'c0010002-0000-0000-0000-000000000000', 2),
('a0010002-0004-0000-0000-000000000000', 'c0010002-0000-0000-0000-000000000000', 3),
('a0010002-0005-0000-0000-000000000000', 'c0010002-0000-0000-0000-000000000000', 4),
('a0010002-0006-0000-0000-000000000000', 'c0010002-0000-0000-0000-000000000000', 5);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text) VALUES
('a0010002-0001-0000-0000-000000000000', 0, 'Am nächsten Morgen begann sein Studium an der Universität Wien.', 'Të nesërmen në mëngjes filluan studimet e tij në Universitetin e Vjenës.'),
('a0010002-0001-0000-0000-000000000000', 1, 'Das Hauptgebäude am Ring war riesig und sah aus wie ein Palast.', 'Ndërtesa kryesore në Ring ishte gjigante dhe dukej si një pallat.'),
('a0010002-0001-0000-0000-000000000000', 2, 'Agron hatte Angst, dass er den Hörsaal nicht rechtzeitig finden würde.', 'Agroni kishte frikë se nuk do ta gjente dot sallën e leksioneve në kohë.'),

('a0010002-0002-0000-0000-000000000000', 0, 'Als er endlich den Raum betrat, saßen schon Hunderte von Studenten dort.', 'Kur ai më në fund hyri në dhomë, qindra studentë ishin ulur tashmë aty.'),
('a0010002-0002-0000-0000-000000000000', 1, 'Der Professor sprach sehr schnell und benutzte viele Fachbegriffe.', 'Profesori fliste shumë shpejt dhe përdorte shumë terma teknikë.'),
('a0010002-0002-0000-0000-000000000000', 2, 'Agron versuchte, alles mitzuschreiben, aber es war wirklich schwer.', 'Agroni u përpoq të shkruante gjithçka, por ishte vërtet e vështirë.'),

('a0010002-0003-0000-0000-000000000000', 0, 'Obwohl er einen Sprachkurs besucht hatte, war das akademische Deutsch eine große Herausforderung.', 'Edhe pse kishte ndjekur një kurs gjuhe, gjermanishtja akademike ishte një sfidë e madhe.'),
('a0010002-0003-0000-0000-000000000000', 1, 'Sein Sitznachbar bemerkte, dass Agron Probleme hatte.', 'Fqinji i tij i ulëses vuri re se Agroni kishte probleme.'),
('a0010002-0003-0000-0000-000000000000', 2, 'Er schob ihm freundlich seine eigenen Notizen rüber.', 'Ai ia shtyu miqësisht shënimet e tij.'),

('a0010002-0004-0000-0000-000000000000', 0, '„Keine Sorge, am Anfang versteht niemand etwas“, flüsterte der Student.', '„Mos u shqetëso, në fillim askush nuk kupton asgjë“, pëshpëriti studenti.'),
('a0010002-0004-0000-0000-000000000000', 1, 'Agron nickte dankbar und konzentrierte sich wieder auf den Professor.', 'Agroni pohoi me kokë i mirënjohur dhe u përqendrua sërish te profesori.'),
('a0010002-0004-0000-0000-000000000000', 2, 'Die Zeit verging sehr langsam, bis endlich die Pause angekündigt wurde.', 'Koha kaloi shumë ngadalë, derisa më në fund u njoftua pushimi.'),

('a0010002-0005-0000-0000-000000000000', 0, 'Nach der Vorlesung ging er in die Mensa, um etwas zu essen.', 'Pas leksionit ai shkoi në mensë për të ngrënë diçka.'),
('a0010002-0005-0000-0000-000000000000', 1, 'Er bestellte ein Wiener Schnitzel, das sehr lecker schmeckte.', 'Ai porositi një Wiener Schnitzel (shnicel vjenez), që shijonte shumë e shijshme.'),
('a0010002-0005-0000-0000-000000000000', 2, 'Dabei überlegte er, dass er unbedingt seinen Wortschatz verbessern musste.', 'Ndërkohë ai mendoi se i duhej patjetër të përmirësonte fjalorin e tij.'),

('a0010002-0006-0000-0000-000000000000', 0, 'Er nahm sich vor, jeden Tag eine österreichische Zeitung zu lesen.', 'Ai i vuri qëllim vetes të lexonte çdo ditë një gazetë austriake.'),
('a0010002-0006-0000-0000-000000000000', 1, 'Außerdem wollte er mehr deutsches Fernsehen schauen, um den Dialekt besser zu verstehen.', 'Përveç kësaj, ai donte të shikonte më shumë televizion gjerman për të kuptuar më mirë dialektin.'),
('a0010002-0006-0000-0000-000000000000', 2, 'Wenn er fleißig lernte, würde er die Prüfungen sicher bestehen.', 'Nëse ai mësonte me zell, ai me siguri do t''i kalonte provimet.');

-- ═══════════════════════════════════════════════════════
-- Kapitulli 3: Heimweh und neue Freunde
-- ═══════════════════════════════════════════════════════
INSERT INTO public.paragraphs (id, chapter_id, order_index) VALUES
('a0010003-0001-0000-0000-000000000000', 'c0010003-0000-0000-0000-000000000000', 0),
('a0010003-0002-0000-0000-000000000000', 'c0010003-0000-0000-0000-000000000000', 1),
('a0010003-0003-0000-0000-000000000000', 'c0010003-0000-0000-0000-000000000000', 2),
('a0010003-0004-0000-0000-000000000000', 'c0010003-0000-0000-0000-000000000000', 3),
('a0010003-0005-0000-0000-000000000000', 'c0010003-0000-0000-0000-000000000000', 4),
('a0010003-0006-0000-0000-000000000000', 'c0010003-0000-0000-0000-000000000000', 5);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text) VALUES
('a0010003-0001-0000-0000-000000000000', 0, 'In den ersten Wochen fühlte sich Agron oft einsam.', 'Në javët e para Agroni ndihej shpesh i vetmuar.'),
('a0010003-0001-0000-0000-000000000000', 1, 'Er vermisste seine Familie, seine Freunde und sogar das laute Chaos in den Straßen von Tirana.', 'Atij i mungonte familja, miqtë e tij dhe madje edhe kaosi i zhurmshëm në rrugët e Tiranës.'),
('a0010003-0001-0000-0000-000000000000', 2, 'Manchmal rief er abends seine Mutter an, die ihm Mut machte.', 'Ndonjëherë ai e telefononte nënën e tij në mbrëmje, e cila i jepte guxim.'),

('a0010003-0002-0000-0000-000000000000', 0, 'Sie sagte immer wieder, dass aller Anfang schwer ist.', 'Ajo thoshte vazhdimisht se çdo fillim është i vështirë.'),
('a0010003-0002-0000-0000-000000000000', 1, '„Du hast dir diesen Traum gewünscht, also gib jetzt nicht auf“, riet sie ihm.', '„Ti e dëshirove këtë ëndërr, prandaj mos u dorëzo tani“, e këshilloi ajo.'),
('a0010003-0002-0000-0000-000000000000', 2, 'Nach diesen Telefonaten fühlte er sich meistens viel besser.', 'Pas këtyre telefonatave ai ndihej kryesisht shumë më mirë.'),

('a0010003-0003-0000-0000-000000000000', 0, 'Eines Tages wurde er in der Bibliothek von einem anderen Studenten angesprochen.', 'Një ditë, atij iu drejtua një student tjetër në bibliotekë.'),
('a0010003-0003-0000-0000-000000000000', 1, '„Ist dieser Platz noch frei?“, fragte ein junger Mann mit Brille.', '„A është ende i lirë ky vend?“, pyeti një djalë i ri me syze.'),
('a0010003-0003-0000-0000-000000000000', 2, 'Er stellte sich als Lukas vor und studierte im selben Studiengang.', 'Ai u prezantua si Lukas dhe studionte në të njëjtin degë studimi.'),

('a0010003-0004-0000-0000-000000000000', 0, 'Sie begannen, zusammen zu lernen und verstanden sich auf Anhieb gut.', 'Ata filluan të mësonin së bashku dhe u kuptuan mirë që në fillim.'),
('a0010003-0004-0000-0000-000000000000', 1, 'Lukas zeigte ihm die besten Cafés der Stadt und half ihm mit der deutschen Grammatik.', 'Lukasi i tregoi kafenetë më të mira në qytet dhe e ndihmoi me gramatikën gjermane.'),
('a0010003-0004-0000-0000-000000000000', 2, 'Als Gegenleistung erzählte Agron ihm Geschichten über Albanien.', 'Në këmbim, Agroni i tregoi atij histori për Shqipërinë.'),

('a0010003-0005-0000-0000-000000000000', 0, 'Langsam begann Agron, sich in Wien wohlzufühlen.', 'Ngadalë Agroni filloi të ndihej rehat në Vjenë.'),
('a0010003-0005-0000-0000-000000000000', 1, 'Er entdeckte seine Lieblingsplätze im Stadtpark und an der Donau.', 'Ai zbuloi vendet e tij të preferuara në parkun e qytetit dhe buzë Danubit.'),
('a0010003-0005-0000-0000-000000000000', 2, 'Besonders gerne saß er abends am Fluss und schaute den Booten zu.', 'Atij i pëlqente veçanërisht të ulej buzë lumit në mbrëmje dhe të shikonte varkat.'),

('a0010003-0006-0000-0000-000000000000', 0, 'Er wusste, dass es noch ein weiter Weg war, aber er war bereit.', 'Ai e dinte se ishte ende një rrugë e gjatë, por ishte gati.'),
('a0010003-0006-0000-0000-000000000000', 1, 'Mit guten Freunden war das Studium nur noch halb so schwer.', 'Me miq të mirë, studimet ishin vetëm gjysma po aq të vështira.'),
('a0010003-0006-0000-0000-000000000000', 2, 'Wien war langsam zu seinem zweiten Zuhause geworden.', 'Vjena ishte bërë ngadalë shtëpia e tij e dytë.');

-- ═══════════════════════════════════════════════════════
-- Kapitulli 4: Die WG-Suche
-- ═══════════════════════════════════════════════════════
INSERT INTO public.paragraphs (id, chapter_id, order_index) VALUES
('a0010004-0001-0000-0000-000000000000', 'c0010004-0000-0000-0000-000000000000', 0),
('a0010004-0002-0000-0000-000000000000', 'c0010004-0000-0000-0000-000000000000', 1),
('a0010004-0003-0000-0000-000000000000', 'c0010004-0000-0000-0000-000000000000', 2),
('a0010004-0004-0000-0000-000000000000', 'c0010004-0000-0000-0000-000000000000', 3),
('a0010004-0005-0000-0000-000000000000', 'c0010004-0000-0000-0000-000000000000', 4),
('a0010004-0006-0000-0000-000000000000', 'c0010004-0000-0000-0000-000000000000', 5);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text) VALUES
('a0010004-0001-0000-0000-000000000000', 0, 'Das Zimmer im Studentenwohnheim war klein und laut.', 'Dhoma në konviktin e studentëve ishte e vogël dhe e zhurmshme.'),
('a0010004-0001-0000-0000-000000000000', 1, 'Deshalb beschloss Agron, eine Wohngemeinschaft, kurz WG, zu suchen.', 'Prandaj Agroni vendosi të kërkojë një apartament të përbashkët, shkurt WG.'),
('a0010004-0001-0000-0000-000000000000', 2, 'Er schaute jeden Tag im Internet nach neuen Angeboten.', 'Ai shikonte çdo ditë në internet për oferta të reja.'),

('a0010004-0002-0000-0000-000000000000', 0, 'Die Wohnungssuche in Wien war jedoch nicht einfach.', 'Megjithatë, kërkimi i apartamentit në Vjenë nuk ishte i lehtë.'),
('a0010004-0002-0000-0000-000000000000', 1, 'Oft waren die Zimmer zu teuer oder die Wohnung lag zu weit weg von der Uni.', 'Shpesh dhomat ishin shumë të shtrenjta ose apartamenti ndodhej shumë larg universitetit.'),
('a0010004-0002-0000-0000-000000000000', 2, 'Trotzdem schrieb er unzählige E-Mails an potenzielle Mitbewohner.', 'Pavarësisht kësaj, ai shkroi e-maile të panumërta për shokë të mundshëm dhome.'),

('a0010004-0003-0000-0000-000000000000', 0, 'Eines Nachmittags wurde er zu einem Casting eingeladen.', 'Një pasdite, ai u ftua në një intervistë (casting).'),
('a0010004-0003-0000-0000-000000000000', 1, 'Die WG befand sich im siebten Bezirk, der für seine vielen Cafés bekannt war.', 'WG-ja ndodhej në distriktin e shtatë, i cili ishte i njohur për kafenetë e tij të shumta.'),
('a0010004-0003-0000-0000-000000000000', 2, 'Agron zog sein bestes Hemd an, um einen guten Eindruck zu machen.', 'Agroni veshi këmishën e tij më të mirë, për të lënë një përshtypje të mirë.'),

('a0010004-0004-0000-0000-000000000000', 0, 'Dort traf er auf Sarah und Markus, die beide Kunst studierten.', 'Atje ai u takua me Sarah dhe Markus, të cilët të dy studionin art.'),
('a0010004-0004-0000-0000-000000000000', 1, 'Die Wohnung war hell und gemütlich, obwohl sie etwas chaotisch aussah.', 'Apartamenti ishte i ndritshëm dhe i rehatshëm, ndonëse dukej disi kaotik.'),
('a0010004-0004-0000-0000-000000000000', 2, 'Sie tranken zusammen Kaffee und redeten über Musik und Reisen.', 'Ata pinë kafe së bashku dhe folën për muzikën dhe udhëtimet.'),

('a0010004-0005-0000-0000-000000000000', 0, 'Am nächsten Tag rief Sarah ihn an und teilte ihm die gute Nachricht mit.', 'Të nesërmen Sarah e telefonoi dhe i dha lajmin e mirë.'),
('a0010004-0005-0000-0000-000000000000', 1, 'Er hatte das Zimmer bekommen, weil sie seine offene Art mochten.', 'Ai e kishte marrë dhomën, sepse atyre u pëlqeu natyra e tij e hapur.'),
('a0010004-0005-0000-0000-000000000000', 2, 'Er war überglücklich und packte sofort seine Sachen.', 'Ai ishte i stërlumtur dhe paketoi menjëherë gjërat e tij.'),

('a0010004-0006-0000-0000-000000000000', 0, 'Der Umzug war anstrengend, aber Lukas half ihm dabei.', 'Shpërngulja ishte e lodhshme, por Lukasi e ndihmoi atë.'),
('a0010004-0006-0000-0000-000000000000', 1, 'Am Abend feierten sie zusammen mit Pizza und Bier den erfolgreichen Umzug.', 'Në mbrëmje ata festuan së bashku me pica dhe birrë shpërnguljen e suksesshme.'),
('a0010004-0006-0000-0000-000000000000', 2, 'Endlich hatte er ein richtiges Zuhause in Wien gefunden.', 'Më në fund ai kishte gjetur një shtëpi të vërtetë në Vjenë.');

-- ═══════════════════════════════════════════════════════
-- Kapitulli 5: Der Nebenjob im Café
-- ═══════════════════════════════════════════════════════
INSERT INTO public.paragraphs (id, chapter_id, order_index) VALUES
('a0010005-0001-0000-0000-000000000000', 'c0010005-0000-0000-0000-000000000000', 0),
('a0010005-0002-0000-0000-000000000000', 'c0010005-0000-0000-0000-000000000000', 1),
('a0010005-0003-0000-0000-000000000000', 'c0010005-0000-0000-0000-000000000000', 2),
('a0010005-0004-0000-0000-000000000000', 'c0010005-0000-0000-0000-000000000000', 3),
('a0010005-0005-0000-0000-000000000000', 'c0010005-0000-0000-0000-000000000000', 4),
('a0010005-0006-0000-0000-000000000000', 'c0010005-0000-0000-0000-000000000000', 5);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text) VALUES
('a0010005-0001-0000-0000-000000000000', 0, 'Da das Leben in Wien sehr teuer war, brauchte Agron dringend einen Nebenjob.', 'Meqenëse jeta në Vjenë ishte shumë e shtrenjtë, Agroni kishte nevojë urgjente për një punë me kohë të pjesshme.'),
('a0010005-0001-0000-0000-000000000000', 1, 'Er druckte einige Lebensläufe aus und verteilte sie in den Cafés der Innenstadt.', 'Ai printoi disa CV dhe i shpërndau ato në kafenetë e qendrës së qytetit.'),
('a0010005-0001-0000-0000-000000000000', 2, 'Schon zwei Tage später erhielt er einen Anruf von einem traditionellen Kaffeehaus.', 'Vetëm dy ditë më vonë, ai mori një telefonatë nga një kafene tradicionale.'),

('a0010005-0002-0000-0000-000000000000', 0, 'Der Besitzer bot ihm einen Job als Kellner für das Wochenende an.', 'Pronari i ofroi një punë si kamerier për fundjavën.'),
('a0010005-0002-0000-0000-000000000000', 1, 'Agron nahm das Angebot sofort an, auch wenn er noch nie als Kellner gearbeitet hatte.', 'Agroni e pranoi ofertën menjëherë, edhe pse nuk kishte punuar kurrë më parë si kamerier.'),
('a0010005-0002-0000-0000-000000000000', 2, 'Sein erster Arbeitstag war an einem regnerischen Samstagmorgen.', 'Dita e tij e parë e punës ishte në një mëngjes të shtune me shi.'),

('a0010005-0003-0000-0000-000000000000', 0, 'Das Café war voller Leute, die Kuchen aßen und Melange tranken.', 'Kafeneja ishte plot me njerëz që hanin ëmbëlsira dhe pinin Melange.'),
('a0010005-0003-0000-0000-000000000000', 1, 'Am Anfang ließ er vor lauter Nervosität fast ein Glas fallen.', 'Në fillim, nga nervozizmi i madh, ai pothuajse rrëzoi një gotë.'),
('a0010005-0003-0000-0000-000000000000', 2, 'Aber seine Kollegen waren sehr hilfsbereit und zeigten ihm alles genau.', 'Por kolegët e tij ishin shumë të gatshëm të ndihmonin dhe i treguan gjithçka me saktësi.'),

('a0010005-0004-0000-0000-000000000000', 0, 'Die größte Herausforderung war, die verschiedenen Kaffeesorten zu unterscheiden.', 'Sfida më e madhe ishte të dallonte llojet e ndryshme të kafesë.'),
('a0010005-0004-0000-0000-000000000000', 1, 'Ein Herr bestellte einen Verlängerten, während eine alte Dame einen Einspänner wollte.', 'Një zotëri porositi një Verlängerten, ndërsa një zonjë e vjetër donte një Einspänner.'),
('a0010005-0004-0000-0000-000000000000', 2, 'Agron musste all diese österreichischen Begriffe schnell lernen.', 'Agronit iu desh t''i mësonte shpejt të gjitha këto terma austriake.'),

('a0010005-0005-0000-0000-000000000000', 0, 'Nach ein paar Wochen wurde er immer besser und routinierter.', 'Pas disa javësh ai bëhej gjithnjë e më i mirë dhe më i rrahur me punën.'),
('a0010005-0005-0000-0000-000000000000', 1, 'Er unterhielt sich gerne mit den Stammgästen, die ihm oft gutes Trinkgeld gaben.', 'Atij i pëlqente të bisedonte me klientët e rregullt, të cilët shpesh i jepnin bakshish të mirë.'),
('a0010005-0005-0000-0000-000000000000', 2, 'So konnte er nicht nur Geld verdienen, sondern auch sein Deutsch verbessern.', 'Kështu ai mundi jo vetëm të fitonte para, por edhe të përmirësonte gjermanishten e tij.'),

('a0010005-0006-0000-0000-000000000000', 0, 'Wenn die Schicht zu Ende war, bekam er oft ein Stück Sachertorte umsonst.', 'Kur turni mbaronte, ai shpesh merrte një copë tortë Sacher falas.'),
('a0010005-0006-0000-0000-000000000000', 1, 'Das war der beste Teil des Jobs, dachte er sich lächelnd.', 'Kjo ishte pjesa më e mirë e punës, mendoi ai duke buzëqeshur.'),
('a0010005-0006-0000-0000-000000000000', 2, 'Die Arbeit war anstrengend, aber er fühlte sich nun noch mehr in Wien integriert.', 'Puna ishte e lodhshme, por ai tani ndihej edhe më i integruar në Vjenë.');

-- ═══════════════════════════════════════════════════════
-- Kapitulli 6: Ein Ausflug in die Berge
-- ═══════════════════════════════════════════════════════
INSERT INTO public.paragraphs (id, chapter_id, order_index) VALUES
('a0010006-0001-0000-0000-000000000000', 'c0010006-0000-0000-0000-000000000000', 0),
('a0010006-0002-0000-0000-000000000000', 'c0010006-0000-0000-0000-000000000000', 1),
('a0010006-0003-0000-0000-000000000000', 'c0010006-0000-0000-0000-000000000000', 2),
('a0010006-0004-0000-0000-000000000000', 'c0010006-0000-0000-0000-000000000000', 3),
('a0010006-0005-0000-0000-000000000000', 'c0010006-0000-0000-0000-000000000000', 4),
('a0010006-0006-0000-0000-000000000000', 'c0010006-0000-0000-0000-000000000000', 5);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text) VALUES
('a0010006-0001-0000-0000-000000000000', 0, 'Der erste Schnee fiel im Dezember und bedeckte die Dächer von Wien.', 'Bora e parë ra në dhjetor dhe mbuloi çatitë e Vjenës.'),
('a0010006-0001-0000-0000-000000000000', 1, 'Markus und Sarah schlugen vor, einen Ausflug in die Alpen zu machen.', 'Markus dhe Sarah sugjeruan të bënin një udhëtim në Alpe.'),
('a0010006-0001-0000-0000-000000000000', 2, 'Agron war begeistert, weil er noch nie in Österreich Ski gefahren war.', 'Agroni ishte i entuziazmuar, sepse nuk kishte bërë kurrë më parë ski në Austri.'),

('a0010006-0002-0000-0000-000000000000', 0, 'Sie mieteten ein Auto und fuhren früh am Samstagmorgen los.', 'Ata morën me qira një makinë dhe u nisën herët të shtunën në mëngjes.'),
('a0010006-0002-0000-0000-000000000000', 1, 'Die Fahrt durch die Berge war atemberaubend schön.', 'Udhëtimi përmes maleve ishte me një bukuri mahnitëse.'),
('a0010006-0002-0000-0000-000000000000', 2, 'Überall sah man weiße Gipfel und kleine Dörfer, die wie aus einem Märchen aussahen.', 'Kudo mund të shiheshin maja të bardha dhe fshatra të vegjël që dukeshin si nga ndonjë përrallë.'),

('a0010006-0003-0000-0000-000000000000', 0, 'Als sie das Skigebiet erreichten, lieh sich Agron eine Skiausrüstung aus.', 'Kur arritën në zonën e skive, Agroni mori hua një pajisje skijimi.'),
('a0010006-0003-0000-0000-000000000000', 1, 'Die ersten Versuche auf den Skiern waren sehr wackelig.', 'Përpjekjet e para mbi ski ishin shumë të lëkundura.'),
('a0010006-0003-0000-0000-000000000000', 2, 'Er fiel mehrmals hin, aber seine Freunde halfen ihm lachend wieder auf.', 'Ai u rrëzua disa herë, por miqtë e tij e ndihmuan të ngrihej duke qeshur.'),

('a0010006-0004-0000-0000-000000000000', 0, 'Gegen Mittag machten sie eine Pause in einer rustikalen Hütte.', 'Rreth mesditës ata bënë një pushim në një kasolle fshatare.'),
('a0010006-0004-0000-0000-000000000000', 1, 'Es roch herrlich nach gebratenem Fleisch und warmem Apfelstrudel.', 'Aty mbante një erë të mrekullueshme mishi të pjekur dhe strudeli të ngrohtë me mollë.'),
('a0010006-0004-0000-0000-000000000000', 2, 'Sie bestellten drei heiße Schokoladen, um sich aufzuwärmen.', 'Ata porositën tre çokollata të nxehta për t''u ngrohur.'),

('a0010006-0005-0000-0000-000000000000', 0, 'Am Nachmittag lief es für Agron schon viel besser auf der Piste.', 'Pasdite, gjërat shkuan shumë më mirë për Agronin në pistë.'),
('a0010006-0005-0000-0000-000000000000', 1, 'Er schaffte es, einen ganzen Hügel ohne Sturz hinunterzufahren.', 'Ai arriti të zbriste një kodër të tërë pa u rrëzuar.'),
('a0010006-0005-0000-0000-000000000000', 2, 'Das Gefühl von Freiheit und die frische Luft machten ihn glücklich.', 'Ndjenja e lirisë dhe ajri i pastër e bënë atë të lumtur.'),

('a0010006-0006-0000-0000-000000000000', 0, 'Als die Sonne unterging, fuhren sie erschöpft, aber zufrieden nach Wien zurück.', 'Kur dielli perëndoi, ata u kthyen në Vjenë të rraskapitur, por të kënaqur.'),
('a0010006-0006-0000-0000-000000000000', 1, 'Dieser Ausflug war einer der besten Tage, die er bisher erlebt hatte.', 'Ky udhëtim ishte një nga ditët më të mira që ai kishte përjetuar deri tani.'),
('a0010006-0006-0000-0000-000000000000', 2, 'Er war froh, dass er den Mut gehabt hatte, im Ausland zu studieren.', 'Ai ishte i lumtur që kishte pasur guximin të studionte jashtë vendit.');

-- ═══════════════════════════════════════════════════════
-- Kapitulli 7: Das erste Semesterende
-- ═══════════════════════════════════════════════════════
INSERT INTO public.paragraphs (id, chapter_id, order_index) VALUES
('a0010007-0001-0000-0000-000000000000', 'c0010007-0000-0000-0000-000000000000', 0),
('a0010007-0002-0000-0000-000000000000', 'c0010007-0000-0000-0000-000000000000', 1),
('a0010007-0003-0000-0000-000000000000', 'c0010007-0000-0000-0000-000000000000', 2),
('a0010007-0004-0000-0000-000000000000', 'c0010007-0000-0000-0000-000000000000', 3),
('a0010007-0005-0000-0000-000000000000', 'c0010007-0000-0000-0000-000000000000', 4),
('a0010007-0006-0000-0000-000000000000', 'c0010007-0000-0000-0000-000000000000', 5);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text) VALUES
('a0010007-0001-0000-0000-000000000000', 0, 'Die Zeit verging wie im Flug und plötzlich standen die ersten Prüfungen vor der Tür.', 'Koha kaloi sa hap e mbyll sytë dhe papritur provimet e para ishin para derës.'),
('a0010007-0001-0000-0000-000000000000', 1, 'Agron verbrachte fast den ganzen Januar in der Universitätsbibliothek.', 'Agroni kaloi pothuajse të gjithë janarin në bibliotekën e universitetit.'),
('a0010007-0001-0000-0000-000000000000', 2, 'Der Druck war groß, weil er sein Stipendium nicht verlieren durfte.', 'Presioni ishte i madh, sepse ai nuk duhej të humbiste bursën e tij.'),

('a0010007-0002-0000-0000-000000000000', 0, 'Lukas und er lernten oft bis spät in die Nacht hinein.', 'Ai dhe Lukasi mësonin shpesh deri vonë në natë.'),
('a0010007-0002-0000-0000-000000000000', 1, 'Sie tranken unmengen an Kaffee, um wach zu bleiben.', 'Ata pinë sasi të mëdha kafeje për të qëndruar zgjuar.'),
('a0010007-0002-0000-0000-000000000000', 2, 'Trotz des Stresses halfen sie sich gegenseitig bei schwierigen Themen.', 'Pavarësisht stresit, ata ndihmuan njëri-tjetrin në temat e vështira.'),

('a0010007-0003-0000-0000-000000000000', 0, 'Am Tag der letzten Prüfung war Agron extrem nervös.', 'Në ditën e provimit të fundit, Agroni ishte jashtëzakonisht nervoz.'),
('a0010007-0003-0000-0000-000000000000', 1, 'Er las sich die Fragen genau durch und atmete tief ein.', 'Ai lexoi pyetjet me kujdes dhe mori frymë thellë.'),
('a0010007-0003-0000-0000-000000000000', 2, 'Zu seiner Erleichterung kannte er die meisten Antworten.', 'Për lehtësimin e tij, ai i dinte shumicën e përgjigjeve.'),

('a0010007-0004-0000-0000-000000000000', 0, 'Zwei Wochen später kamen die Ergebnisse per E-Mail.', 'Dy javë më vonë erdhën rezultatet me e-mail.'),
('a0010007-0004-0000-0000-000000000000', 1, 'Er hatte alle Klausuren bestanden, einige sogar mit sehr guten Noten.', 'Ai kishte kaluar të gjitha provimet, disa madje me nota shumë të mira.'),
('a0010007-0004-0000-0000-000000000000', 2, 'Sofort rief er seine Eltern in Albanien an, um ihnen die guten Neuigkeiten mitzuteilen.', 'Ai telefonoi menjëherë prindërit e tij në Shqipëri për t''u dhënë lajmet e mira.'),

('a0010007-0005-0000-0000-000000000000', 0, 'Seine Mutter weinte vor Freude am Telefon.', 'Nëna e tij qau nga gëzimi në telefon.'),
('a0010007-0005-0000-0000-000000000000', 1, '„Wir wussten, dass du es schaffst“, sagte sein Vater stolz.', '„Ne e dinim që do t''ia dilje“, tha babai i tij me krenari.'),
('a0010007-0005-0000-0000-000000000000', 2, 'Agron spürte, dass sich die harte Arbeit endlich gelohnt hatte.', 'Agroni ndjeu se puna e palodhur më në fund kishte dhënë fryte.'),

('a0010007-0006-0000-0000-000000000000', 0, 'Am selben Abend organisierte die WG eine große Party, um das Semesterende zu feiern.', 'Po atë mbrëmje, WG-ja organizoi një festë të madhe për të festuar fundin e semestrit.'),
('a0010007-0006-0000-0000-000000000000', 1, 'Viele Freunde kamen vorbei und sie tanzten bis in die frühen Morgenstunden.', 'Shumë miq erdhën dhe ata kërcyen deri në orët e para të mëngjesit.'),
('a0010007-0006-0000-0000-000000000000', 2, 'Sein Neuanfang in Wien war ein voller Erfolg geworden.', 'Fillimi i tij i ri në Vjenë ishte bërë një sukses i plotë.');
