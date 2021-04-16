use event_manager;

CREATE TABLE Ratings (
	ID int primary key not null auto_increment,
  eventID int not null,
  userID int not null,
  rating int not null,
  FOREIGN KEY (eventID) REFERENCES Events(ID),
  FOREIGN KEY (userID) REFERENCES Users(ID)
);
