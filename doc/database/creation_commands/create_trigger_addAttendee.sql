use event_manager;

SELECT
Events.ID AS eventID,
Events.schoolID AS schoolID,
UN.ID AS schoolID,
UN.name AS schoolName,
UN.address AS schoolAddress,
UN.city AS schoolCity,
UN.zip AS schoolZip,
UN.description AS schoolDescription,
UN.phonenumber AS schoolPhonenumber,
UN.numStudents AS schoolNumStudents,
ST1.Name AS SchoolStateName,
Events.rsoID AS rsoID,
RSO.name AS rsoName,
MT.ID AS meetingTypeID,
MT.name AS meetingTypeName,
Events.name AS eventName,
Events.description AS eventDescription,
Events.address AS eventAddress,
Events.city AS eventCity,
ST.ID AS stateID,
ST.name AS stateName,
ST.acronym AS stateAcronym,
Events.zip AS eventZip,
Events.room AS eventRoom,
Events.rating AS eventRating,
Events.isPublic AS isPublic,
Events.numAttendees AS numAttendees,
Events.capacity AS eventCapacity,
EP.ID AS eventPictureID,
EP.picture AS eventPicture,
EP.position AS eventPicturePosition
FROM Events
INNER JOIN Events AS E1 ON (Events.ID=E1.ID AND ((Events.schoolID=1 AND Events.rsoID=1 AND Events.isPublic=false) OR (Events.schoolID=1 AND Events.isPublic=true)))
LEFT JOIN Registered_Student_Organizations AS RSO ON (RSO.ID=Events.rsoID AND RSO.universityID=Events.schoolID)
LEFT JOIN Event_Pictures AS EP ON (Events.ID=EP.eventID) -- creates separate event record for each picture
LEFT JOIN Meeting_Types AS MT ON (Events.meetingType=MT.ID)
LEFT JOIN States AS ST ON (Events.stateID=ST.ID)
LEFT JOIN Universities AS UN ON (Events.schoolID=UN.ID)
LEFT JOIN States AS ST1 ON (UN.stateID=ST1.ID)
ORDER BY Events.ID ASC;