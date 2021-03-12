use event_manager;

create table Users (
ID int primary key not null auto_increment,
username varchar(30) not null,
firstName varchar(50) not null,
lastName varchar(50) not null,
password varchar(30) not null,
email varchar(50) not null,
universityID int,
rsoID int,
role int not null,
foreign key (universityID) references Universities(ID),
foreign key (rsoID) references Registered_Student_Organizations(ID),
foreign key (role) references Roles(ID)
);
