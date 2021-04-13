use event_manager;

delimiter //

CREATE TRIGGER decrementNumAttendeesOnDelete
AFTER DELETE ON Attendees
FOR EACH ROW
BEGIN
	UPDATE Events SET Events.numAttendees=(Events.numAttendees - 1) WHERE Events.ID=OLD.eventID;
END;//

delimiter ;
