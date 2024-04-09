USE studentDatabase;
--  CREATE TABLE returnedBooks (
--  studentId INT(10),
-- book_title VARCHAR(255),
-- author VARCHAR(255),
-- publishers VARCHAR(255),
-- book_edition VARCHAR(255),
-- returned_date VARCHAR(255),
-- book_id INT
-- );

-- SELECT * FROM returnedBooks;
-- -- ALTER TABLE completedBooks
-- -- ADD COLUMN returned TINYINT(1) DEFAULT 0;
SELECT * FROM reservedBooks;
SELECT * FROM completedBooks;
SELECT * FROM rejectedBooks;
SELECT * FROM returnedBooks;
DELETE FROM completedBooks;
DELETE FROM returnedBooks;
DELETE FROM reservedBooks;
-- ALTER TABLE reservedBooks
-- ADD COLUMN deadline_date VARCHAR(255);