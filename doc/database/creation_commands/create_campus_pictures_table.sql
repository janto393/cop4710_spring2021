use event_manager;

create table Campus_Pictures(
ID int primary key not null auto_increment,
universityID int not null,
picture mediumblob not null,
position int not null,

foreign key (universityID) references Universities(ID)

);
