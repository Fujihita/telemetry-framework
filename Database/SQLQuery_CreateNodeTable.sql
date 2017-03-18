IF OBJECT_ID('db_datawriter.nodes', 'U') IS NOT NULL
  DROP TABLE db_datawriter.nodes
GO

CREATE TABLE db_datawriter.nodes
(
	NodeID INT IDENTITY(1,1) PRIMARY KEY,
	--IMEI (15) or Mac Address (17)
	DeviceID VARCHAR(17) NOT NULL UNIQUE,
	NodeName VARCHAR(20) NOT NULL DEFAULT 'Unknown',
	Latitude DECIMAL(9,6) NULL CHECK ((Latitude > -85.000000) and (Latitude < 85.000000)),
	Longtitude DECIMAL(9,6) NULL CHECK ((Longtitude > -180.000000) and (Longtitude < 180.000000)),
	Altitude DECIMAL(9,6) NULL
)
GO