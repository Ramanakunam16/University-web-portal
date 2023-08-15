
--Database creation
CREATE DATABASE studentDatabase;

--Table Creation 
USE studentDatabase;
--
CREATE TABLE studentDetails (
    registrationNo INT,
    studentName CHAR(20),
    semNo INT,
    sGPA FLOAT
);
--
CREATE TABLE studentMarksDetails (
    registartionNo INT,
    semNo INT,
    subjectCode CHAR(20),
    gradePoints INT
);