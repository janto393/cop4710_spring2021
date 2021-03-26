use event_manager;

create table Profile_Pictures(
ID int primary key not null auto_increment,
userID int not null,
filename varchar(30) not null,
picture mediumblob not null,

foreign key (userID) references Users(ID)

);
