use event_manager;

create table Attendees(
ID INT primary key not null auto_increment,
eventID INT not null,
userID INT not null,
foreign key (eventID) references Events(ID),
foreign key (userID) references Users(ID)
);
