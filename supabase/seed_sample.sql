-- ═══════════════════════════════════════════════════════
-- LIBRI — Sample Seed Data
-- A sample chapter from a German text with Albanian translations
-- Run this AFTER the schema migration
-- ═══════════════════════════════════════════════════════

-- Insert a sample book
INSERT INTO public.books (id, title, author, source_language, target_language, total_chapters)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Der kleine Prinz',
  'Antoine de Saint-Exupéry',
  'de',
  'sq',
  2
);

-- Insert Chapter 1
INSERT INTO public.chapters (id, book_id, chapter_number, title)
VALUES (
  'c0000001-0000-0000-0000-000000000001',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1,
  'Die Zeichnung'
);

-- Insert Chapter 2
INSERT INTO public.chapters (id, book_id, chapter_number, title)
VALUES (
  'c0000001-0000-0000-0000-000000000002',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2,
  'Die Begegnung'
);

-- ═══════════════════════════════════════════════════════
-- Chapter 1 Paragraphs & Sentences
-- ═══════════════════════════════════════════════════════

-- Paragraph 1
INSERT INTO public.paragraphs (id, chapter_id, order_index)
VALUES ('a1000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 0);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a1000001-0000-0000-0000-000000000001', 0, 
 'Als ich sechs Jahre alt war, sah ich einmal in einem Buch über den Urwald ein prächtiges Bild.',
 'Kur isha gjashtë vjeç, pashë njëherë në një libër rreth xhunglës një figurë të mrekullueshme.',
 'When I was six years old, I once saw a magnificent picture in a book about the jungle.'),
('a1000001-0000-0000-0000-000000000001', 1,
 'Es stellte eine Riesenschlange dar, die ein Raubtier verschlang.',
 'Ajo paraqiste një gjarpër gjigant që po gëlltiste një bishë.',
 'It depicted a giant snake swallowing a beast of prey.'),
('a1000001-0000-0000-0000-000000000001', 2,
 'In dem Buch stand: „Die Riesenschlangen verschlingen ihre Beute ganz, ohne sie zu zerkauen."',
 'Në libër shkruhej: „Gjarpërinjtë gjigantë e gëlltitë prenë e tyre të plotë, pa e përtypur."',
 'In the book it said: "Boa constrictors swallow their prey whole, without chewing it."');

-- Paragraph 2
INSERT INTO public.paragraphs (id, chapter_id, order_index)
VALUES ('a1000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 1);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a1000001-0000-0000-0000-000000000002', 0,
 'Daraufhin habe ich viel über die Abenteuer des Dschungels nachgedacht und habe dann meinerseits mit einem Farbstift meine erste Zeichnung zustande gebracht.',
 'Pastaj mendova shumë rreth aventurave të xhunglës dhe pastaj, me radhën time, me një laps me ngjyrë, bëra vizatimin tim të parë.',
 'I pondered deeply, then, over the adventures of the jungle. And after some work with a colored pencil I succeeded in making my first drawing.'),
('a1000001-0000-0000-0000-000000000002', 1,
 'Meine Zeichnung Nummer 1 sah so aus.',
 'Vizatimi im numër 1 dukej kështu.',
 'My drawing number one looked like this.');

-- Paragraph 3
INSERT INTO public.paragraphs (id, chapter_id, order_index)
VALUES ('a1000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 2);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a1000001-0000-0000-0000-000000000003', 0,
 'Ich habe den großen Leuten mein Meisterwerk gezeigt und sie gefragt, ob ihnen meine Zeichnung Angst mache.',
 'Ua tregova të rriturve kryeveprën time dhe i pyeta nëse vizatimi im u bënte frikë.',
 'I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them.'),
('a1000001-0000-0000-0000-000000000003', 1,
 'Sie haben mir geantwortet: „Warum sollte uns ein Hut Angst machen?"',
 'Ata m''u përgjigjën: „Pse do të na bënte frikë një kapelë?"',
 'They answered me: "Why should anyone be frightened by a hat?"');

-- Paragraph 4
INSERT INTO public.paragraphs (id, chapter_id, order_index)
VALUES ('a1000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 3);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a1000001-0000-0000-0000-000000000004', 0,
 'Meine Zeichnung stellte aber keinen Hut dar.',
 'Vizatimi im megjithatë nuk paraqiste një kapelë.',
 'But my drawing was not a picture of a hat.'),
('a1000001-0000-0000-0000-000000000004', 1,
 'Sie stellte eine Riesenschlange dar, die einen Elefanten verdaut.',
 'Ai paraqiste një gjarpër gjigant që po treste një elefant.',
 'It was a picture of a boa constrictor digesting an elephant.'),
('a1000001-0000-0000-0000-000000000004', 2,
 'Da die großen Leute von allein nie etwas verstehen, ist es für die Kinder sehr anstrengend, ihnen immer und immer wieder alles erklären zu müssen.',
 'Meqë të rriturit asnjëherë nuk kuptojnë asgjë vetë, është shumë e lodhshme për fëmijët që t''u shpjegojnë atyre gjithçka gjithnjë e gjithnjë.',
 'Since grown-ups never understand anything by themselves, it is exhausting for children to have to explain things to them over and over again.');

-- ═══════════════════════════════════════════════════════
-- Chapter 2 Paragraphs & Sentences
-- ═══════════════════════════════════════════════════════

-- Paragraph 1
INSERT INTO public.paragraphs (id, chapter_id, order_index)
VALUES ('a2000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 0);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a2000001-0000-0000-0000-000000000001', 0,
 'So lebte ich allein, ohne jemanden, mit dem ich wirklich hätte sprechen können, bis ich vor sechs Jahren einmal eine Panne in der Wüste Sahara hatte.',
 'Kështu jetova vetëm, pa asnjë njeri me të cilin mund të flisja me të vërtetë, derisa gjashtë vjet më parë pësova një defekt në Shkretëtirën e Saharasë.',
 'So I lived my life alone, without anyone that I could really talk to, until I had a breakdown in the Sahara Desert six years ago.'),
('a2000001-0000-0000-0000-000000000001', 1,
 'Etwas an meinem Motor war kaputtgegangen.',
 'Diçka në motorin tim kishte prishur.',
 'Something was broken in my engine.');

-- Paragraph 2
INSERT INTO public.paragraphs (id, chapter_id, order_index)
VALUES ('a2000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 1);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a2000001-0000-0000-0000-000000000002', 0,
 'Und da ich weder einen Mechaniker noch Passagiere bei mir hatte, machte ich mich ganz allein an die schwierige Reparatur.',
 'Dhe meqë nuk kisha as mekanik as pasagjerë me vete, u vura vetë në riparimin e vështirë.',
 'And as I had with me neither a mechanic nor any passengers, I set myself to attempt the difficult repairs all alone.'),
('a2000001-0000-0000-0000-000000000002', 1,
 'Es war für mich eine Frage auf Leben und Tod.',
 'Ishte për mua çështje jete a vdekjeje.',
 'It was a question of life or death for me.'),
('a2000001-0000-0000-0000-000000000002', 2,
 'Ich hatte kaum Trinkwasser für acht Tage.',
 'Kisha mezi ujë të pijshëm për tetë ditë.',
 'I had scarcely enough drinking water to last eight days.');

-- Paragraph 3
INSERT INTO public.paragraphs (id, chapter_id, order_index)
VALUES ('a2000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000002', 2);

INSERT INTO public.sentences (paragraph_id, order_index, original_text, translated_text_sq, translated_text_en) VALUES
('a2000001-0000-0000-0000-000000000003', 0,
 'Am ersten Abend bin ich also im Sande eingeschlafen, tausend Meilen von jeder bewohnten Gegend entfernt.',
 'Natën e parë fjeta pra në rërë, njëmijë milje larg çdo zone të banuar.',
 'The first night, then, I went to sleep on the sand, a thousand miles from any human habitation.'),
('a2000001-0000-0000-0000-000000000003', 1,
 'Ich war viel verlassener als ein Schiffbrüchiger auf einem Floß mitten im Ozean.',
 'Isha shumë më i vetmuar se një i mbijetuar anijeje mbi një trap në mes të oqeanit.',
 'I was more isolated than a shipwrecked sailor on a raft in the middle of the ocean.'),
('a2000001-0000-0000-0000-000000000003', 2,
 'Ihr könnt euch daher meine Überraschung vorstellen, als bei Tagesanbruch eine seltsame kleine Stimme mich weckte.',
 'Mund ta imagjinoni pra habinë time, kur në agimin e ditës një zë i çuditshëm i vogël më zgjoi.',
 'Thus you can imagine my amazement, at sunrise, when I was awakened by an odd little voice.'),
('a2000001-0000-0000-0000-000000000003', 3,
 'Sie sagte: „Bitte… zeichne mir ein Schaf!"',
 'Ai tha: „Të lutem… më vizato një dele!"',
 'It said: "If you please... draw me a sheep!"');
