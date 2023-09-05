
<<<<<<< HEAD
--Database creation
=======
-- --Database creation
>>>>>>> 3070d1a6d61c43c5a1110731b8a637797d178671
CREATE DATABASE studentDatabase;

--Table Creation 
USE studentDatabase;

<<<<<<< HEAD
--<<<<<<< HEAD
=======
>>>>>>> 3070d1a6d61c43c5a1110731b8a637797d178671
CREATE TABLE studentDetails (
    registrationNumber INT,
    studentName CHAR(50),
    sem INT,
    totalResults FLOAT
);
CREATE TABLE studentMarksDetails (
    registrationNumber INT,
    sem INT,
    subjectName CHAR(50),

    gradePoints INT
);



<<<<<<< HEAD
-- CREATE TABLE UploadedData (
--     studentName CHAR(20),
--     registrationNumber INT,
--     sem INT,
--     s1 INT,
--     s2 INT,
--     s3 INT,
--     s4 INT,
--     s5 INT,
--     sGPA FLOAT
-- );

=======
-- -- CREATE TABLE UploadedData (
-- --     studentName CHAR(20),
-- --     registrationNumber INT,
-- --     sem INT,
-- --     s1 INT,
-- --     s2 INT,
-- --     s3 INT,
-- --     s4 INT,
-- --     s5 INT,
-- --     sGPA FLOAT
-- -- );
>>>>>>> 3070d1a6d61c43c5a1110731b8a637797d178671


CREATE TABLE users (
user_name  VARCHAR(255) PRIMARY KEY,
user_email VARCHAR(255),
hasedPassword VARCHAR(255)
);

<<<<<<< HEAD
-- >>>>>>> 2d080d5c550440fc420380445b6f29015ad1a5c2
=======
>>>>>>> 3070d1a6d61c43c5a1110731b8a637797d178671
