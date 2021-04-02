use event_manager;

delimiter //

CREATE TRIGGER ensureNewCapacityIsValid
BEFORE UPDATE ON Events
FOR EACH ROW
BEGIN
	SET @numAttendees = (SELECT numAttendees FROM Events WHERE NEW.ID=Events.ID);
  IF (@numAttendees > NEW.capacity) THEN
		-- set a not-null field in the update to prevent the insert
    SET NEW.ID = NULL;
  END IF;
END;//

delimiter ;