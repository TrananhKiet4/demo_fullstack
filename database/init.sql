CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT,
  age INT,
  email TEXT
);

INSERT INTO students (name, age, email)
VALUES ('Nguyen Van A', 20, 'a@gmail.com');
