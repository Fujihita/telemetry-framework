IF OBJECT_ID('db_datawriter.uspInsertReport') IS NOT NULL
  DROP PROCEDURE db_datawriter.uspInsertReport
GO

CREATE PROCEDURE db_datawriter.uspInsertReport
(
 @NodeID Int,
 @Port  TinyInt,
 @Reading VarChar(10),
 @Latitude DECIMAL(9,6) = NULL,
 @Longtitude DECIMAL(9,6) = NULL,
 @Altitude DECIMAL(9,6) = NULL
) 
AS
 BEGIN
	DECLARE @S_Latitude VARCHAR(20), @S_Longtitude VARCHAR(20), @S_Altitude VARCHAR(20) 
	SELECT @S_Latitude = Latitude, @S_Longtitude = Longtitude, @S_Altitude = Altitude FROM db_datawriter.nodes WHERE NodeID = @NodeID
	DECLARE @Class VARCHAR(20), @Unit VARCHAR(20)
	SELECT @Class = Class, @Unit = Unit FROM db_datawriter.config WHERE NodeID = @NodeID AND Port = @Port
	IF @S_Latitude IS NULL OR @S_Longtitude IS NULL OR @S_Altitude IS NULL
		INSERT INTO db_datawriter.reports
		(NodeID, Port, Class, Unit, Reading, Latitude, Longtitude, Altitude)
		VALUES (@NodeID, @Port, @Class, @Unit, @Reading, @Latitude, @Longtitude, @Altitude)
	ELSE
		INSERT INTO db_datawriter.reports
		(NodeID, Port, Class, Unit, Reading, Latitude, Longtitude, Altitude)
		VALUES (@NodeID, @Port, @Class, @Unit, @Reading, @S_Latitude, @S_Longtitude, @S_Altitude)
 END
 GO