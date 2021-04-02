use event_manager;

create table Events(
ID int primary key not null auto_increment,
schoolID int not null,
stateID int not null,
rsoID int,
meetingType int not null,
name varchar(100) not null,
description varchar(500) not null,
address varchar(100) not null,
city varchar(50) not null,
zip varchar(5) not null,
room varchar(10) not null,
rating read(2, 1) not null,
isPublic bool not null,
numAttendees int not null,
capacity int not null,
foreign key (meetingType) references Meeting_Types(ID),
foreign key (rsoID) references Registered_Student_Organizations(ID),
foreign key (stateID) references States(ID),
foreign key (schoolID) references Universities(ID)
);
