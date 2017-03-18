IF OBJECT_ID('db_datawriter.uspInsertNode') IS NOT NULL
  DROP PROCEDURE db_datawriter.uspInsertNode
GO

CREATE PROCEDURE db_datawriter.uspInsertNode
(
 @DeviceID VarChar(17),
 @NodeID INT OUTPUT
) 
AS
 BEGIN
	IF (SELECT NodeID FROM db_datawriter.nodes WHERE DeviceID = @DeviceID) IS NULL
		INSERT INTO db_datawriter.nodes (DeviceID) VALUES (@DeviceID)
	SELECT @NodeID = NodeID FROM db_datawriter.nodes WHERE DeviceID = @DeviceID
 END
 GO