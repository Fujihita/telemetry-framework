IF OBJECT_ID('db_datawriter.reports', 'U') IS NOT NULL
  DROP TABLE db_datawriter.reports
GO

CREATE TABLE db_datawriter.reports
(
	Tstamp DateTime default GetDate(),
	NodeID INT NOT NULL,
	Port TINYINT NOT NULL DEFAULT 0,
	Class VARCHAR(20) NOT NULL DEFAULT 'Generic',
	Unit VARCHAR(20) NULL,
	Reading VARCHAR(10) NOT NULL,
	Latitude DECIMAL(9,6) NOT NULL CHECK ((Latitude > -85.000000) and (Latitude < 85.000000)),
	Longtitude DECIMAL(9,6) NOT NULL CHECK ((Longtitude > -180.000000) and (Longtitude < 180.000000)),
	Altitude DECIMAL(9,6) NOT NULL,
	CONSTRAINT FK_report_nodePortID FOREIGN KEY (NodeID, Port) REFERENCES db_datawriter.config(NodeID, Port) ON DELETE CASCADE,
	CONSTRAINT PK_testID PRIMARY KEY (Tstamp, NodeID, Port)
)
GO