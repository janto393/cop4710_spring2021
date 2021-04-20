use event_manager;

create table Registered_Student_Organizations(
ID INT primary key not null auto_increment,
name varchar(30) not null,
universityID INT not null,
isApproved TINYINT DEFAULT 0, 
foreign key (universityID) references Universities(ID)
);