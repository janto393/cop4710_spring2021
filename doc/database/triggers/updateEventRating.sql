use event_manager;

delimiter //

CREATE TRIGGER updateEventRating
AFTER INSERT ON Ratings
FOR EACH ROW
BEGIN
	SET @eventID = NEW.eventID;
	SET @newRatingAverage = (SELECT AVG(ALL rating) FROM Ratings WHERE eventID=@eventID);
  UPDATE Events SET rating=@newRatingAverage WHERE ID=@EventID;
END;//

delimiter ;