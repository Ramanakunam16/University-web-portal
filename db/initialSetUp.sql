-- -- --Database creation
-- -- CREATE DATABASE studentDatabase;

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

-- CREATE TABLE users (
-- user_name  VARCHAR(255) PRIMARY KEY,
-- user_email VARCHAR(255),
-- hashedPassword VARCHAR(255)
-- );
CREATE TABLE usersProfilePics (
user_name VARCHAR(255),
file_name TEXT,
mime_type TEXT,
data LONGBLOB


);
