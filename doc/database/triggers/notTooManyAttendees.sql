use event_manager;

delimiter //
create trigger notTooManyAttendees
before insert on Attendees
FOR EACH ROW
BEGIN
  SET @numAttendees = (SELECT numAttendees FROM Events WHERE NEW.eventID=Events.ID);
  SET @capacity = (SELECT capacity FROM Events WHERE NEW.eventID=Events.ID);
	IF (@numAttendees + 1 > @capacity) THEN
		-- set a not-null field in the insert row to prevent the insert
    SET NEW.eventID = NULL;
    SET NEW.userID = NULL;
	ELSE
		-- Increment the numAttendees in the events table
    UPDATE Events SET Events.numAttendees = (Events.numAttendees + 1) WHERE Events.ID=NEW.eventID;
  END IF;
END;//

delimiter ;