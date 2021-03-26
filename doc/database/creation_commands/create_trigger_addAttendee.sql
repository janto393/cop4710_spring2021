use event_manager;
DELIMITER $$

CREATE TRIGGER t_country_insert AFTER INSERT
ON Attendees 
FOR EACH ROW BEGIN
IN
END$$
DELIMITER ;  

