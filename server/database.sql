
CREATE DATABASE perntodo;

create table users
(
  user_id uuid DEFAULT uuid_generate_v4 (),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  UNIQUE (email),
  UNIQUE(user_id),
  PRIMARY KEY
  (user_id)
);

create table todolists
(
  todolist_id uuid DEFAULT uuid_generate_v4 (),
  title TEXT NOT NULL,
  user_id uuid,
  UNIQUE
    (todolist_id),
  PRIMARY KEY
    (todolist_id)
);


create table todo
(
  todo_id uuid DEFAULT uuid_generate_v4 (),
  description VARCHAR(50) NOT  NULL,
  todolist_id uuid,
  UNIQUE (todo_id),
  UNIQUE (todolist_id),
  PRIMARY KEY (todo_id)
);

alter table todo ADD FOREIGN KEY
(todolist_id) REFERENCES todolists
(todolist_id) ON
DELETE CASCADE;

alter table todolists ADD FOREIGN KEY
(user_id) REFERENCES users
(user_id) ON
DELETE CASCADE;

