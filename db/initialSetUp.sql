-- -- --Database creation
-- CREATE DATABASE studentDatabase;

-- --Table Creation 
USE studentDatabase;

-- CREATE TABLE studentDetails (
--     registrationNumber INT ,
--     studentName CHAR(50),
--     sem INT,
--     totalResults FLOAT
-- );

-- CREATE TABLE studentMarksDetails (
--     registrationNumber INT,
--     sem INT,
--     subjectName CHAR(50),

--     gradePoints INT
-- );



-- -- -- CREATE TABLE UploadedData (
-- -- --     studentName CHAR(20),
-- -- --     registrationNumber INT,
-- -- --     sem INT,
-- -- --     s1 INT,
-- -- --     s2 INT,
-- -- --     s3 INT,
-- -- --     s4 INT,
-- -- --     s5 INT,
-- -- --     sGPA FLOAT
-- -- -- );

-- CREATE TABLE studentLoginInfo (
-- user_id  INT(10) PRIMARY KEY,
-- user_name VARCHAR(255),
-- user_email VARCHAR(255),
-- temp_password INT,
-- hashedPassword VARCHAR(255)
-- );
-- CREATE TABLE studentProfilePics (
-- user_id  INT(10) PRIMARY KEY ,
-- file_name TEXT,
-- mime_type TEXT,
-- data LONGBLOB
-- );

-- CREATE TABLE facultyLoginInfo  (
-- user_id  INT(10) PRIMARY KEY,
-- user_name  VARCHAR(255),
-- user_email VARCHAR(255),
-- temp_password INT,
-- hashedPassword VARCHAR(255)
-- );

-- CREATE TABLE reservedBooks(

-- studentId INT(10),
-- book_title VARCHAR(255),
-- author VARCHAR(255),
-- publishers VARCHAR(255),
-- book_edition VARCHAR(255),
-- book_img LONGBLOB
-- );


-- 

CREATE TABLE rejectedBooks(
studentId INT(10),
book_title VARCHAR(255),
author VARCHAR(255),
publishers VARCHAR(255),
book_edition VARCHAR(255),
reason VARCHAR(255),
book_id INT
);
CREATE TABLE completedBooks(
studentId INT(10),
book_title VARCHAR(255),
author VARCHAR(255),
publishers VARCHAR(255),
book_edition VARCHAR(255),
book_id INT
);