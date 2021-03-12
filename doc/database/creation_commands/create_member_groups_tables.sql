use event_manager;

create table Member_Groups(
ID INT primary key not null auto_increment,
userID INT not null,
rsoID INT not null,
foreign key (userID) references Users(ID),
foreign key (rsoID) references Users(rsoID)
);
