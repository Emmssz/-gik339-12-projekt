DROP TABLE IF EXISTS resources;

CREATE TABLE IF NOT EXISTS resources(
id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
,name           VARCHAR(10) NOT NULL
,grafiskAspekt  VARCHAR(20) NOT NULL
);

-- Skapar testdata

INSERT INTO resources(id,name,grafiskAspekt) VALUES (1, 'Tjorven', 'circle');

SELECT * FROM resources;