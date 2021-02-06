create table Timezones (
	ID int primary key not null auto_increment,
  Name varchar(100) not null,
  Abbreviation varchar(10) not null,
  Offset_Value int not null
);