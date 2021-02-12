use event_manager;

create table Comments(
ID int primary key not null auto_increment,
timeTag date not null,
comment varchar(500) not null,
userID int not null,
eventID int not null,
foreign key (userID) references Users(ID),
foreign key (eventID) references Events(ID)
);