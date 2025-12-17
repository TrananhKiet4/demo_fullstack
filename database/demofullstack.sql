CREATE DATABASE DemoFullstack;
GO

USE DemoFullstack;
GO

CREATE TABLE Messages (
  Id INT IDENTITY PRIMARY KEY,
  Content NVARCHAR(255)
);

INSERT INTO Messages(Content)
VALUES ('Hello from SQL Server');
