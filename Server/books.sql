DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books(
id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
,boktitel       VARCHAR(25) NOT NULL
,forfattare     VARCHAR(20) NOT NULL
,genre          VARCHAR(10) NOT NULL
,status         VARCHAR(20) NOT NULL
);

-- Skapar testdata

INSERT INTO books(id,boktitel,forfattare,genre,status) VALUES (1, 'Pippi','Astrid Lindgren', 'Barn','Tillgänglig');
INSERT INTO books(id,boktitel,forfattare,genre,status) VALUES (2, 'Grundläggande statistisk analys','Björn Lantz', 'Studentlitteratur','Reserverad');
INSERT INTO books(id,boktitel,forfattare,genre,status) VALUES (3, 'Madicken','Astrid Lindgren', 'Barn','Utlånad');

SELECT * FROM books;