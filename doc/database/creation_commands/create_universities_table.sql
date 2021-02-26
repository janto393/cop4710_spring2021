use event_manager;

create table Universities (
ID int primary key not null auto_increment,
stateID int not null,
name varchar(100) not null,
address varchar(100) not null,
city varchar(50) not null,
zip varchar(5) not null,
description varchar(500),
phoneNumber char(10) not null,
numStudents int not null,
email varchar(50),
foreign key (stateID) references States(ID)
);