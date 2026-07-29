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

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a0010001-0001-0000-0000-000000000000', 0, 'Als der Zug endlich am Wiener Hauptbahnhof ankam, war Agron erschöpft, aber glücklich.', 'Kur treni mbërriti më në fund në Stacionin Qendror të Vjenës, Agroni ishte i rraskapitur, por i lumtur.', 'When the train finally arrived at Vienna Central Station, Agron was exhausted but happy.'),
('a0010001-0001-0000-0000-000000000000', 1, 'Er hatte eine lange Reise aus Tirana hinter sich, die fast den ganzen Tag gedauert hatte.', 'Ai kishte kaluar një udhëtim të gjatë nga Tirana, i cili kishte zgjatur pothuajse gjithë ditën.', 'He had a long journey from Tirana behind him, which had lasted almost the entire day.'),
('a0010001-0001-0000-0000-000000000000', 2, 'Obwohl er schon viel über Wien gelesen hatte, war die Realität noch beeindruckender.', 'Ndonëse kishte lexuar shumë për Vjenën, realiteti ishte edhe më mbresëlënës.', 'Although he had already read a lot about Vienna, the reality was even more impressive.'),

('a0010001-0002-0000-0000-000000000000', 0, 'Er nahm seinen schweren Koffer und stieg aus dem Zug.', 'Ai mori valixhen e tij të rëndë dhe zbriti nga treni.', 'He took his heavy suitcase and got off the train.'),
('a0010001-0002-0000-0000-000000000000', 1, 'Die Luft war kühl und die vielen Menschen eilten in alle Richtungen.', 'Ajri ishte i ftohtë dhe njerëzit e shumtë nxitonin në të gjitha drejtimet.', 'The air was cool and the many people hurried in all directions.'),
('a0010001-0002-0000-0000-000000000000', 2, 'Zuerst musste er herausfinden, wie man eine Fahrkarte für die U-Bahn kauft.', 'Në fillim atij iu desh të zbulonte se si blihet një biletë për metronë.', 'First, he had to figure out how to buy a ticket for the subway.'),

('a0010001-0003-0000-0000-000000000000', 0, 'An einem Fahrkartenautomaten stand eine junge Frau, die er höflich auf Deutsch um Hilfe bat.', 'Në një automat biletash qëndronte një grua e re, të cilës ai i kërkoi ndihmë me mirësjellje në gjermanisht.', 'A young woman was standing at a ticket machine, whom he politely asked for help in German.'),
('a0010001-0003-0000-0000-000000000000', 1, '„Entschuldigung, könnten Sie mir bitte zeigen, wie ich ein Ticket nach Favoriten bekomme?“, fragte er nervös.', '„Më falni, a mund të më tregoni ju lutem, se si të marr një biletë për në Favoriten?“, pyeti ai me nervozizëm.', '"Excuse me, could you please show me how to get a ticket to Favoriten?" he asked nervously.'),
('a0010001-0003-0000-0000-000000000000', 2, 'Die Frau lächelte freundlich und erklärte ihm, dass er einfach eine Einzelfahrkarte für die Stadtzone brauche.', 'Gruaja buzëqeshi miqësisht dhe i shpjegoi se atij i duhej thjesht një biletë e vetme për zonën e qytetit.', 'The woman smiled friendly and explained to him that he just needed a single ticket for the city zone.'),

('a0010001-0004-0000-0000-000000000000', 0, 'Agron bedankte sich und kaufte das Ticket, das zwei Euro und vierzig Cent kostete.', 'Agroni e falënderoi dhe bleu biletën, e cila kushtonte dy euro e dyzet cent.', 'Agron thanked her and bought the ticket, which cost two euros and forty cents.'),
('a0010001-0004-0000-0000-000000000000', 1, 'Er war erleichtert, weil er sie ohne Probleme verstanden hatte.', 'Agroni u lehtësua, sepse ai e kishte kuptuar atë pa probleme.', 'He was relieved because he had understood her without any problems.'),
('a0010001-0004-0000-0000-000000000000', 2, 'Mit dem Ticket in der Hand suchte er den Weg zur U-Bahn-Linie U1.', 'Me biletën në dorë, ai kërkoi rrugën për te linja e metrosë U1.', 'With the ticket in hand, he looked for the way to the U1 subway line.'),

('a0010001-0005-0000-0000-000000000000', 0, 'Die U-Bahn-Station war sehr sauber und gut beleuchtet.', 'Stacioni i metrosë ishte shumë i pastër dhe i ndriçuar mirë.', 'The subway station was very clean and well lit.'),
('a0010001-0005-0000-0000-000000000000', 1, 'Nach wenigen Minuten kam ein roter Zug angebraust.', 'Pas pak minutash erdhi me vrull një tren i kuq.', 'After a few minutes, a red train came roaring in.'),
('a0010001-0005-0000-0000-000000000000', 2, 'Er stieg ein und setzte sich neben das Fenster, um die Stadt zu beobachten.', 'Ai hipi dhe u ul pranë dritares, për të vëzhguar qytetin.', 'He got in and sat next to the window to observe the city.'),

('a0010001-0006-0000-0000-000000000000', 0, 'Die Fahrt zu seinem Studentenwohnheim dauerte nicht lange.', 'Udhëtimi drejt konviktit të tij studentor nuk zgjati shumë.', 'The ride to his student dormitory didn''t take long.'),
('a0010001-0006-0000-0000-000000000000', 1, 'Als er endlich vor dem großen Gebäude stand, atmete er tief durch.', 'Kur ai më në fund qëndroi para ndërtesës së madhe, mori frymë thellë.', 'When he finally stood in front of the large building, he took a deep breath.'),
('a0010001-0006-0000-0000-000000000000', 2, 'Das war der Beginn seines neuen Lebenszeugnisses in Österreich.', 'Ky ishte fillimi i dëshmisë së jetës së tij të re në Austri.', 'This was the beginning of his new life chapter in Austria.');

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

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a0010002-0001-0000-0000-000000000000', 0, 'Am nächsten Morgen begann sein Studium an der Universität Wien.', 'Të nesërmen në mëngjes filluan studimet e tij në Universitetin e Vjenës.', 'The next morning, his studies at the University of Vienna began.'),
('a0010002-0001-0000-0000-000000000000', 1, 'Das Hauptgebäude am Ring war riesig und sah aus wie ein Palast.', 'Ndërtesa kryesore në Ring ishte gjigante dhe dukej si një pallat.', 'The main building on the Ring was huge and looked like a palace.'),
('a0010002-0001-0000-0000-000000000000', 2, 'Agron hatte Angst, dass er den Hörsaal nicht rechtzeitig finden würde.', 'Agroni kishte frikë se nuk do ta gjente dot sallën e leksioneve në kohë.', 'Agron was afraid that he wouldn''t find the lecture hall in time.'),

('a0010002-0002-0000-0000-000000000000', 0, 'Als er endlich den Raum betrat, saßen schon Hunderte von Studenten dort.', 'Kur ai më në fund hyri në dhomë, qindra studentë ishin ulur tashmë aty.', 'When he finally entered the room, hundreds of students were already sitting there.'),
('a0010002-0002-0000-0000-000000000000', 1, 'Der Professor sprach sehr schnell und benutzte viele Fachbegriffe.', 'Profesori fliste shumë shpejt dhe përdorte shumë terma teknikë.', 'The professor spoke very fast and used many technical terms.'),
('a0010002-0002-0000-0000-000000000000', 2, 'Agron versuchte, alles mitzuschreiben, aber es war wirklich schwer.', 'Agroni u përpoq të shkruante gjithçka, por ishte vërtet e vështirë.', 'Agron tried to write everything down, but it was really hard.'),

('a0010002-0003-0000-0000-000000000000', 0, 'Obwohl er einen Sprachkurs besucht hatte, war das akademische Deutsch eine große Herausforderung.', 'Edhe pse kishte ndjekur një kurs gjuhe, gjermanishtja akademike ishte një sfidë e madhe.', 'Even though he had attended a language course, academic German was a big challenge.'),
('a0010002-0003-0000-0000-000000000000', 1, 'Sein Sitznachbar bemerkte, dass Agron Probleme hatte.', 'Fqinji i tij i ulëses vuri re se Agroni kishte probleme.', 'His seat neighbor noticed that Agron was having problems.'),
('a0010002-0003-0000-0000-000000000000', 2, 'Er schob ihm freundlich seine eigenen Notizen rüber.', 'Ai ia shtyu miqësisht shënimet e tij.', 'He kindly slid his own notes over to him.'),

('a0010002-0004-0000-0000-000000000000', 0, '„Keine Sorge, am Anfang versteht niemand etwas“, flüsterte der Student.', '„Mos u shqetëso, në fillim askush nuk kupton asgjë“, pëshpëriti studenti.', '"Don''t worry, in the beginning, nobody understands anything," the student whispered.'),
('a0010002-0004-0000-0000-000000000000', 1, 'Agron nickte dankbar und konzentrierte sich wieder auf den Professor.', 'Agroni pohoi me kokë i mirënjohur dhe u përqendrua sërish te profesori.', 'Agron nodded gratefully and focused back on the professor.'),
('a0010002-0004-0000-0000-000000000000', 2, 'Die Zeit verging sehr langsam, bis endlich die Pause angekündigt wurde.', 'Koha kaloi shumë ngadalë, derisa më në fund u njoftua pushimi.', 'Time passed very slowly until the break was finally announced.'),

('a0010002-0005-0000-0000-000000000000', 0, 'Nach der Vorlesung ging er in die Mensa, um etwas zu essen.', 'Pas leksionit ai shkoi në mensë për të ngrënë diçka.', 'After the lecture, he went to the cafeteria to eat something.'),
('a0010002-0005-0000-0000-000000000000', 1, 'Er bestellte ein Wiener Schnitzel, das sehr lecker schmeckte.', 'Ai porositi një Wiener Schnitzel (shnicel vjenez), që shijonte shumë e shijshme.', 'He ordered a Wiener Schnitzel, which tasted very delicious.'),
('a0010002-0005-0000-0000-000000000000', 2, 'Dabei überlegte er, dass er unbedingt seinen Wortschatz verbessern musste.', 'Ndërkohë ai mendoi se i duhej patjetër të përmirësonte fjalorin e tij.', 'While doing so, he thought that he absolutely had to improve his vocabulary.'),

('a0010002-0006-0000-0000-000000000000', 0, 'Er nahm sich vor, jeden Tag eine österreichische Zeitung zu lesen.', 'Ai i vuri qëllim vetes të lexonte çdo ditë një gazetë austriake.', 'He resolved to read an Austrian newspaper every day.'),
('a0010002-0006-0000-0000-000000000000', 1, 'Außerdem wollte er mehr deutsches Fernsehen schauen, um den Dialekt besser zu verstehen.', 'Përveç kësaj, ai donte të shikonte më shumë televizion gjerman për të kuptuar më mirë dialektin.', 'Besides, he wanted to watch more German television to better understand the dialect.'),
('a0010002-0006-0000-0000-000000000000', 2, 'Wenn er fleißig lernte, würde er die Prüfungen sicher bestehen.', 'Nëse ai mësonte me zell, ai me siguri do t''i kalonte provimet.', 'If he studied diligently, he would surely pass the exams.');

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

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a0010003-0001-0000-0000-000000000000', 0, 'In den ersten Wochen fühlte sich Agron oft einsam.', 'Në javët e para Agroni ndihej shpesh i vetmuar.', 'In the first few weeks, Agron often felt lonely.'),
('a0010003-0001-0000-0000-000000000000', 1, 'Er vermisste seine Familie, seine Freunde und sogar das laute Chaos in den Straßen von Tirana.', 'Atij i mungonte familja, miqtë e tij dhe madje edhe kaosi i zhurmshëm në rrugët e Tiranës.', 'He missed his family, his friends, and even the loud chaos in the streets of Tirana.'),
('a0010003-0001-0000-0000-000000000000', 2, 'Manchmal rief er abends seine Mutter an, die ihm Mut machte.', 'Ndonjëherë ai e telefononte nënën e tij në mbrëmje, e cila i jepte guxim.', 'Sometimes he called his mother in the evening, who encouraged him.'),

('a0010003-0002-0000-0000-000000000000', 0, 'Sie sagte immer wieder, dass aller Anfang schwer ist.', 'Ajo thoshte vazhdimisht se çdo fillim është i vështirë.', 'She kept saying that every beginning is hard.'),
('a0010003-0002-0000-0000-000000000000', 1, '„Du hast dir diesen Traum gewünscht, also gib jetzt nicht auf“, riet sie ihm.', '„Ti e dëshirove këtë ëndërr, prandaj mos u dorëzo tani“, e këshilloi ajo.', '"You wished for this dream, so don''t give up now," she advised him.'),
('a0010003-0002-0000-0000-000000000000', 2, 'Nach diesen Telefonaten fühlte er sich meistens viel besser.', 'Pas këtyre telefonatave ai ndihej kryesisht shumë më mirë.', 'After these phone calls, he mostly felt much better.'),

('a0010003-0003-0000-0000-000000000000', 0, 'Eines Tages wurde er in der Bibliothek von einem anderen Studenten angesprochen.', 'Një ditë, atij iu drejtua një student tjetër në bibliotekë.', 'One day, he was approached by another student in the library.'),
('a0010003-0003-0000-0000-000000000000', 1, '„Ist dieser Platz noch frei?“, fragte ein junger Mann mit Brille.', '„A është ende i lirë ky vend?“, pyeti një djalë i ri me syze.', '"Is this seat still free?" asked a young man with glasses.'),
('a0010003-0003-0000-0000-000000000000', 2, 'Er stellte sich als Lukas vor und studierte im selben Studiengang.', 'Ai u prezantua si Lukas dhe studionte në të njëjtin degë studimi.', 'He introduced himself as Lukas and was studying in the same program.'),

('a0010003-0004-0000-0000-000000000000', 0, 'Sie begannen, zusammen zu lernen und verstanden sich auf Anhieb gut.', 'Ata filluan të mësonin së bashku dhe u kuptuan mirë që në fillim.', 'They started studying together and got along well right away.'),
('a0010003-0004-0000-0000-000000000000', 1, 'Lukas zeigte ihm die besten Cafés der Stadt und half ihm mit der deutschen Grammatik.', 'Lukasi i tregoi kafenetë më të mira në qytet dhe e ndihmoi me gramatikën gjermane.', 'Lukas showed him the best cafes in the city and helped him with German grammar.'),
('a0010003-0004-0000-0000-000000000000', 2, 'Als Gegenleistung erzählte Agron ihm Geschichten über Albanien.', 'Në këmbim, Agroni i tregoi atij histori për Shqipërinë.', 'In return, Agron told him stories about Albania.'),

('a0010003-0005-0000-0000-000000000000', 0, 'Langsam begann Agron, sich in Wien wohlzufühlen.', 'Ngadalë Agroni filloi të ndihej rehat në Vjenë.', 'Slowly, Agron began to feel comfortable in Vienna.'),
('a0010003-0005-0000-0000-000000000000', 1, 'Er entdeckte seine Lieblingsplätze im Stadtpark und an der Donau.', 'Ai zbuloi vendet e tij të preferuara në parkun e qytetit dhe buzë Danubit.', 'He discovered his favorite places in the city park and along the Danube.'),
('a0010003-0005-0000-0000-000000000000', 2, 'Besonders gerne saß er abends am Fluss und schaute den Booten zu.', 'Atij i pëlqente veçanërisht të ulej buzë lumit në mbrëmje dhe të shikonte varkat.', 'He especially liked sitting by the river in the evening and watching the boats.'),

('a0010003-0006-0000-0000-000000000000', 0, 'Er wusste, dass es noch ein weiter Weg war, aber er war bereit.', 'Ai e dinte se ishte ende një rrugë e gjatë, por ishte gati.', 'He knew that there was still a long way to go, but he was ready.'),
('a0010003-0006-0000-0000-000000000000', 1, 'Mit guten Freunden war das Studium nur noch halb so schwer.', 'Me miq të mirë, studimet ishin vetëm gjysma po aq të vështira.', 'With good friends, studying was only half as hard.'),
('a0010003-0006-0000-0000-000000000000', 2, 'Wien war langsam zu seinem zweiten Zuhause geworden.', 'Vjena ishte bërë ngadalë shtëpia e tij e dytë.', 'Vienna had slowly become his second home.');

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

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a0010004-0001-0000-0000-000000000000', 0, 'Das Zimmer im Studentenwohnheim war klein und laut.', 'Dhoma në konviktin e studentëve ishte e vogël dhe e zhurmshme.', 'The room in the student dormitory was small and loud.'),
('a0010004-0001-0000-0000-000000000000', 1, 'Deshalb beschloss Agron, eine Wohngemeinschaft, kurz WG, zu suchen.', 'Prandaj Agroni vendosi të kërkojë një apartament të përbashkët, shkurt WG.', 'Therefore, Agron decided to look for a shared apartment, WG for short.'),
('a0010004-0001-0000-0000-000000000000', 2, 'Er schaute jeden Tag im Internet nach neuen Angeboten.', 'Ai shikonte çdo ditë në internet për oferta të reja.', 'He checked the internet every day for new offers.'),

('a0010004-0002-0000-0000-000000000000', 0, 'Die Wohnungssuche in Wien war jedoch nicht einfach.', 'Megjithatë, kërkimi i apartamentit në Vjenë nuk ishte i lehtë.', 'However, the apartment hunt in Vienna was not easy.'),
('a0010004-0002-0000-0000-000000000000', 1, 'Oft waren die Zimmer zu teuer oder die Wohnung lag zu weit weg von der Uni.', 'Shpesh dhomat ishin shumë të shtrenjta ose apartamenti ndodhej shumë larg universitetit.', 'Often the rooms were too expensive or the apartment was too far away from the university.'),
('a0010004-0002-0000-0000-000000000000', 2, 'Trotzdem schrieb er unzählige E-Mails an potenzielle Mitbewohner.', 'Pavarësisht kësaj, ai shkroi e-maile të panumërta për shokë të mundshëm dhome.', 'Nevertheless, he wrote countless emails to potential roommates.'),

('a0010004-0003-0000-0000-000000000000', 0, 'Eines Nachmittags wurde er zu einem Casting eingeladen.', 'Një pasdite, ai u ftua në një intervistë (casting).', 'One afternoon, he was invited to a viewing.'),
('a0010004-0003-0000-0000-000000000000', 1, 'Die WG befand sich im siebten Bezirk, der für seine vielen Cafés bekannt war.', 'WG-ja ndodhej në distriktin e shtatë, i cili ishte i njohur për kafenetë e tij të shumta.', 'The shared apartment was located in the seventh district, which was known for its many cafes.'),
('a0010004-0003-0000-0000-000000000000', 2, 'Agron zog sein bestes Hemd an, um einen guten Eindruck zu machen.', 'Agroni veshi këmishën e tij më të mirë, për të lënë një përshtypje të mirë.', 'Agron put on his best shirt to make a good impression.'),

('a0010004-0004-0000-0000-000000000000', 0, 'Dort traf er auf Sarah und Markus, die beide Kunst studierten.', 'Atje ai u takua me Sarah dhe Markus, të cilët të dy studionin art.', 'There he met Sarah and Markus, who were both studying art.'),
('a0010004-0004-0000-0000-000000000000', 1, 'Die Wohnung war hell und gemütlich, obwohl sie etwas chaotisch aussah.', 'Apartamenti ishte i ndritshëm dhe i rehatshëm, ndonëse dukej disi kaotik.', 'The apartment was bright and cozy, although it looked a bit chaotic.'),
('a0010004-0004-0000-0000-000000000000', 2, 'Sie tranken zusammen Kaffee und redeten über Musik und Reisen.', 'Ata pinë kafe së bashku dhe folën për muzikën dhe udhëtimet.', 'They drank coffee together and talked about music and traveling.'),

('a0010004-0005-0000-0000-000000000000', 0, 'Am nächsten Tag rief Sarah ihn an und teilte ihm die gute Nachricht mit.', 'Të nesërmen Sarah e telefonoi dhe i dha lajmin e mirë.', 'The next day, Sarah called him and shared the good news.'),
('a0010004-0005-0000-0000-000000000000', 1, 'Er hatte das Zimmer bekommen, weil sie seine offene Art mochten.', 'Ai e kishte marrë dhomën, sepse atyre u pëlqeu natyra e tij e hapur.', 'He had gotten the room because they liked his open nature.'),
('a0010004-0005-0000-0000-000000000000', 2, 'Er war überglücklich und packte sofort seine Sachen.', 'Ai ishte i stërlumtur dhe paketoi menjëherë gjërat e tij.', 'He was overjoyed and immediately packed his things.'),

('a0010004-0006-0000-0000-000000000000', 0, 'Der Umzug war anstrengend, aber Lukas half ihm dabei.', 'Shpërngulja ishte e lodhshme, por Lukasi e ndihmoi atë.'),
('a0010004-0006-0000-0000-000000000000', 1, 'Am Abend feierten sie zusammen mit Pizza und Bier den erfolgreichen Umzug.', 'Në mbrëmje ata festuan së bashku me pica dhe birrë shpërnguljen e suksesshme.', 'In the evening, they celebrated the successful move together with pizza and beer.'),
('a0010004-0006-0000-0000-000000000000', 2, 'Endlich hatte er ein richtiges Zuhause in Wien gefunden.', 'Më në fund ai kishte gjetur një shtëpi të vërtetë në Vjenë.', 'He had finally found a real home in Vienna.');

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

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a0010005-0001-0000-0000-000000000000', 0, 'Da das Leben in Wien sehr teuer war, brauchte Agron dringend einen Nebenjob.', 'Meqenëse jeta në Vjenë ishte shumë e shtrenjtë, Agroni kishte nevojë urgjente për një punë me kohë të pjesshme.', 'Since life in Vienna was very expensive, Agron urgently needed a part-time job.'),
('a0010005-0001-0000-0000-000000000000', 1, 'Er druckte einige Lebensläufe aus und verteilte sie in den Cafés der Innenstadt.', 'Ai printoi disa CV dhe i shpërndau ato në kafenetë e qendrës së qytetit.', 'He printed out some resumes and distributed them in the downtown cafes.'),
('a0010005-0001-0000-0000-000000000000', 2, 'Schon zwei Tage später erhielt er einen Anruf von einem traditionellen Kaffeehaus.', 'Vetëm dy ditë më vonë, ai mori një telefonatë nga një kafene tradicionale.', 'Just two days later, he received a call from a traditional coffee house.'),

('a0010005-0002-0000-0000-000000000000', 0, 'Der Besitzer bot ihm einen Job als Kellner für das Wochenende an.', 'Pronari i ofroi një punë si kamerier për fundjavën.', 'The owner offered him a job as a waiter for the weekend.'),
('a0010005-0002-0000-0000-000000000000', 1, 'Agron nahm das Angebot sofort an, auch wenn er noch nie als Kellner gearbeitet hatte.', 'Agroni e pranoi ofertën menjëherë, edhe pse nuk kishte punuar kurrë më parë si kamerier.', 'Agron accepted the offer immediately, even though he had never worked as a waiter before.'),
('a0010005-0002-0000-0000-000000000000', 2, 'Sein erster Arbeitstag war an einem regnerischen Samstagmorgen.', 'Dita e tij e parë e punës ishte në një mëngjes të shtune me shi.', 'His first day of work was on a rainy Saturday morning.'),

('a0010005-0003-0000-0000-000000000000', 0, 'Das Café war voller Leute, die Kuchen aßen und Melange tranken.', 'Kafeneja ishte plot me njerëz që hanin ëmbëlsira dhe pinin Melange.', 'The cafe was full of people eating cake and drinking Melange.'),
('a0010005-0003-0000-0000-000000000000', 1, 'Am Anfang ließ er vor lauter Nervosität fast ein Glas fallen.', 'Në fillim, nga nervozizmi i madh, ai pothuajse rrëzoi një gotë.', 'At first, he almost dropped a glass out of sheer nervousness.'),
('a0010005-0003-0000-0000-000000000000', 2, 'Aber seine Kollegen waren sehr hilfsbereit und zeigten ihm alles genau.', 'Por kolegët e tij ishin shumë të gatshëm të ndihmonin dhe i treguan gjithçka me saktësi.', 'But his colleagues were very helpful and showed him everything in detail.'),

('a0010005-0004-0000-0000-000000000000', 0, 'Die größte Herausforderung war, die verschiedenen Kaffeesorten zu unterscheiden.', 'Sfida më e madhe ishte të dallonte llojet e ndryshme të kafesë.', 'The biggest challenge was to distinguish the different types of coffee.'),
('a0010005-0004-0000-0000-000000000000', 1, 'Ein Herr bestellte einen Verlängerten, während eine alte Dame einen Einspänner wollte.', 'Një zotëri porositi një Verlängerten, ndërsa një zonjë e vjetër donte një Einspänner.', 'A gentleman ordered a Verlängerter, while an old lady wanted an Einspänner.'),
('a0010005-0004-0000-0000-000000000000', 2, 'Agron musste all diese österreichischen Begriffe schnell lernen.', 'Agronit iu desh t''i mësonte shpejt të gjitha këto terma austriake.', 'Agron had to learn all these Austrian terms quickly.'),

('a0010005-0005-0000-0000-000000000000', 0, 'Nach ein paar Wochen wurde er immer besser und routinierter.', 'Pas disa javësh ai bëhej gjithnjë e më i mirë dhe më i rrahur me punën.', 'After a few weeks, he became better and more experienced.'),
('a0010005-0005-0000-0000-000000000000', 1, 'Er unterhielt sich gerne mit den Stammgästen, die ihm oft gutes Trinkgeld gaben.', 'Atij i pëlqente të bisedonte me klientët e rregullt, të cilët shpesh i jepnin bakshish të mirë.', 'He enjoyed chatting with the regular customers, who often gave him good tips.'),
('a0010005-0005-0000-0000-000000000000', 2, 'So konnte er nicht nur Geld verdienen, sondern auch sein Deutsch verbessern.', 'Kështu ai mundi jo vetëm të fitonte para, por edhe të përmirësonte gjermanishten e tij.', 'This way, he could not only earn money but also improve his German.'),

('a0010005-0006-0000-0000-000000000000', 0, 'Wenn die Schicht zu Ende war, bekam er oft ein Stück Sachertorte umsonst.', 'Kur turni mbaronte, ai shpesh merrte një copë tortë Sacher falas.', 'When the shift was over, he often got a piece of Sachertorte for free.'),
('a0010005-0006-0000-0000-000000000000', 1, 'Das war der beste Teil des Jobs, dachte er sich lächelnd.', 'Kjo ishte pjesa më e mirë e punës, mendoi ai duke buzëqeshur.', 'That was the best part of the job, he thought to himself smiling.'),
('a0010005-0006-0000-0000-000000000000', 2, 'Die Arbeit war anstrengend, aber er fühlte sich nun noch mehr in Wien integriert.', 'Puna ishte e lodhshme, por ai tani ndihej edhe më i integruar në Vjenë.', 'The work was exhausting, but he now felt even more integrated into Vienna.');

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

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a0010006-0001-0000-0000-000000000000', 0, 'Der erste Schnee fiel im Dezember und bedeckte die Dächer von Wien.', 'Bora e parë ra në dhjetor dhe mbuloi çatitë e Vjenës.', 'The first snow fell in December and covered the roofs of Vienna.'),
('a0010006-0001-0000-0000-000000000000', 1, 'Markus und Sarah schlugen vor, einen Ausflug in die Alpen zu machen.', 'Markus dhe Sarah sugjeruan të bënin një udhëtim në Alpe.', 'Markus and Sarah suggested taking a trip to the Alps.'),
('a0010006-0001-0000-0000-000000000000', 2, 'Agron war begeistert, weil er noch nie in Österreich Ski gefahren war.', 'Agroni ishte i entuziazmuar, sepse nuk kishte bërë kurrë më parë ski në Austri.', 'Agron was thrilled because he had never skied in Austria before.'),

('a0010006-0002-0000-0000-000000000000', 0, 'Sie mieteten ein Auto und fuhren früh am Samstagmorgen los.', 'Ata morën me qira një makinë dhe u nisën herët të shtunën në mëngjes.', 'They rented a car and left early on Saturday morning.'),
('a0010006-0002-0000-0000-000000000000', 1, 'Die Fahrt durch die Berge war atemberaubend schön.', 'Udhëtimi përmes maleve ishte me një bukuri mahnitëse.', 'The drive through the mountains was breathtakingly beautiful.'),
('a0010006-0002-0000-0000-000000000000', 2, 'Überall sah man weiße Gipfel und kleine Dörfer, die wie aus einem Märchen aussahen.', 'Kudo mund të shiheshin maja të bardha dhe fshatra të vegjël që dukeshin si nga ndonjë përrallë.', 'Everywhere you could see white peaks and small villages that looked like they were from a fairy tale.'),

('a0010006-0003-0000-0000-000000000000', 0, 'Als sie das Skigebiet erreichten, lieh sich Agron eine Skiausrüstung aus.', 'Kur arritën në zonën e skive, Agroni mori hua një pajisje skijimi.', 'When they reached the ski area, Agron rented ski equipment.'),
('a0010006-0003-0000-0000-000000000000', 1, 'Die ersten Versuche auf den Skiern waren sehr wackelig.', 'Përpjekjet e para mbi ski ishin shumë të lëkundura.', 'The first attempts on the skis were very shaky.'),
('a0010006-0003-0000-0000-000000000000', 2, 'Er fiel mehrmals hin, aber seine Freunde halfen ihm lachend wieder auf.', 'Ai u rrëzua disa herë, por miqtë e tij e ndihmuan të ngrihej duke qeshur.', 'He fell down several times, but his friends laughingly helped him back up.'),

('a0010006-0004-0000-0000-000000000000', 0, 'Gegen Mittag machten sie eine Pause in einer rustikalen Hütte.', 'Rreth mesditës ata bënë një pushim në një kasolle fshatare.', 'Around noon, they took a break in a rustic cabin.'),
('a0010006-0004-0000-0000-000000000000', 1, 'Es roch herrlich nach gebratenem Fleisch und warmem Apfelstrudel.', 'Aty mbante një erë të mrekullueshme mishi të pjekur dhe strudeli të ngrohtë me mollë.', 'It smelled wonderfully of roasted meat and warm apple strudel.'),
('a0010006-0004-0000-0000-000000000000', 2, 'Sie bestellten drei heiße Schokoladen, um sich aufzuwärmen.', 'Ata porositën tre çokollata të nxehta për t''u ngrohur.', 'They ordered three hot chocolates to warm up.'),

('a0010006-0005-0000-0000-000000000000', 0, 'Am Nachmittag lief es für Agron schon viel besser auf der Piste.', 'Pasdite, gjërat shkuan shumë më mirë për Agronin në pistë.', 'In the afternoon, things went much better for Agron on the slopes.'),
('a0010006-0005-0000-0000-000000000000', 1, 'Er schaffte es, einen ganzen Hügel ohne Sturz hinunterzufahren.', 'Ai arriti të zbriste një kodër të tërë pa u rrëzuar.', 'He managed to ski down an entire hill without falling.'),
('a0010006-0005-0000-0000-000000000000', 2, 'Das Gefühl von Freiheit und die frische Luft machten ihn glücklich.', 'Ndjenja e lirisë dhe ajri i pastër e bënë atë të lumtur.', 'The feeling of freedom and the fresh air made him happy.'),

('a0010006-0006-0000-0000-000000000000', 0, 'Als die Sonne unterging, fuhren sie erschöpft, aber zufrieden nach Wien zurück.', 'Kur dielli perëndoi, ata u kthyen në Vjenë të rraskapitur, por të kënaqur.', 'When the sun went down, they drove back to Vienna, exhausted but satisfied.'),
('a0010006-0006-0000-0000-000000000000', 1, 'Dieser Ausflug war einer der besten Tage, die er bisher erlebt hatte.', 'Ky udhëtim ishte një nga ditët më të mira që ai kishte përjetuar deri tani.', 'This trip was one of the best days he had experienced so far.'),
('a0010006-0006-0000-0000-000000000000', 2, 'Er war froh, dass er den Mut gehabt hatte, im Ausland zu studieren.', 'Ai ishte i lumtur që kishte pasur guximin të studionte jashtë vendit.', 'He was glad that he had had the courage to study abroad.');

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

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a0010007-0001-0000-0000-000000000000', 0, 'Die Zeit verging wie im Flug und plötzlich standen die ersten Prüfungen vor der Tür.', 'Koha kaloi sa hap e mbyll sytë dhe papritur provimet e para ishin para derës.', 'Time flew by and suddenly the first exams were just around the corner.'),
('a0010007-0001-0000-0000-000000000000', 1, 'Agron verbrachte fast den ganzen Januar in der Universitätsbibliothek.', 'Agroni kaloi pothuajse të gjithë janarin në bibliotekën e universitetit.', 'Agron spent almost the entire January in the university library.'),
('a0010007-0001-0000-0000-000000000000', 2, 'Der Druck war groß, weil er sein Stipendium nicht verlieren durfte.', 'Presioni ishte i madh, sepse ai nuk duhej të humbiste bursën e tij.', 'The pressure was high because he couldn''t afford to lose his scholarship.'),

('a0010007-0002-0000-0000-000000000000', 0, 'Lukas und er lernten oft bis spät in die Nacht hinein.', 'Ai dhe Lukasi mësonin shpesh deri vonë në natë.', 'Lukas and he often studied late into the night.'),
('a0010007-0002-0000-0000-000000000000', 1, 'Sie tranken unmengen an Kaffee, um wach zu bleiben.', 'Ata pinë sasi të mëdha kafeje për të qëndruar zgjuar.', 'They drank huge amounts of coffee to stay awake.'),
('a0010007-0002-0000-0000-000000000000', 2, 'Trotz des Stresses halfen sie sich gegenseitig bei schwierigen Themen.', 'Pavarësisht stresit, ata ndihmuan njëri-tjetrin në temat e vështira.', 'Despite the stress, they helped each other with difficult topics.'),

('a0010007-0003-0000-0000-000000000000', 0, 'Am Tag der letzten Prüfung war Agron extrem nervös.', 'Në ditën e provimit të fundit, Agroni ishte jashtëzakonisht nervoz.', 'On the day of the last exam, Agron was extremely nervous.'),
('a0010007-0003-0000-0000-000000000000', 1, 'Er las sich die Fragen genau durch und atmete tief ein.', 'Ai lexoi pyetjet me kujdes dhe mori frymë thellë.', 'He read through the questions carefully and took a deep breath.'),
('a0010007-0003-0000-0000-000000000000', 2, 'Zu seiner Erleichterung kannte er die meisten Antworten.', 'Për lehtësimin e tij, ai i dinte shumicën e përgjigjeve.', 'To his relief, he knew most of the answers.'),

('a0010007-0004-0000-0000-000000000000', 0, 'Zwei Wochen später kamen die Ergebnisse per E-Mail.', 'Dy javë më vonë erdhën rezultatet me e-mail.', 'Two weeks later, the results arrived by email.'),
('a0010007-0004-0000-0000-000000000000', 1, 'Er hatte alle Klausuren bestanden, einige sogar mit sehr guten Noten.', 'Ai kishte kaluar të gjitha provimet, disa madje me nota shumë të mira.', 'He had passed all exams, some even with very good grades.'),
('a0010007-0004-0000-0000-000000000000', 2, 'Sofort rief er seine Eltern in Albanien an, um ihnen die guten Neuigkeiten mitzuteilen.', 'Ai telefonoi menjëherë prindërit e tij në Shqipëri për t''u dhënë lajmet e mira.', 'He immediately called his parents in Albania to share the good news with them.'),

('a0010007-0005-0000-0000-000000000000', 0, 'Seine Mutter weinte vor Freude am Telefon.', 'Nëna e tij qau nga gëzimi në telefon.', 'His mother cried tears of joy on the phone.'),
('a0010007-0005-0000-0000-000000000000', 1, '„Wir wussten, dass du es schaffst“, sagte sein Vater stolz.', '„Ne e dinim që do t''ia dilje“, tha babai i tij me krenari.', '"We knew you would do it," his father said proudly.'),
('a0010007-0005-0000-0000-000000000000', 2, 'Agron spürte, dass sich die harte Arbeit endlich gelohnt hatte.', 'Agroni ndjeu se puna e palodhur më në fund kishte dhënë fryte.', 'Agron felt that the hard work had finally paid off.'),

('a0010007-0006-0000-0000-000000000000', 0, 'Am selben Abend organisierte die WG eine große Party, um das Semesterende zu feiern.', 'Po atë mbrëmje, WG-ja organizoi një festë të madhe për të festuar fundin e semestrit.', 'That same evening, the flatmates organized a big party to celebrate the end of the semester.'),
('a0010007-0006-0000-0000-000000000000', 1, 'Viele Freunde kamen vorbei und sie tanzten bis in die frühen Morgenstunden.', 'Shumë miq erdhën dhe ata kërcyen deri në orët e para të mëngjesit.', 'Many friends came by and they danced until the early morning hours.'),
('a0010007-0006-0000-0000-000000000000', 2, 'Sein Neuanfang in Wien war ein voller Erfolg geworden.', 'Fillimi i tij i ri në Vjenë ishte bërë një sukses i plotë.', 'His fresh start in Vienna had become a complete success.');
