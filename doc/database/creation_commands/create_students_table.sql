USE event_manager;

CREATE TABLE Students (
	userID INT NOT NULL PRIMARY KEY,
  universityID INT NOT NULL,
  isApproved TINYINT NOT NULL DEFAULT 0,
  FOREIGN KEY (userID) REFERENCES Users(ID),
  FOREIGN KEY (universityID) REFERENCES Universities(ID)
);