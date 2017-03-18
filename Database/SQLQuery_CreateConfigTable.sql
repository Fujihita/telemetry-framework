IF OBJECT_ID('db_datawriter.config', 'U') IS NOT NULL
  DROP TABLE db_datawriter.config
GO

CREATE TABLE db_datawriter.config
(
	NodeID INT NOT NULL,
	Port TINYINT NOT NULL DEFAULT 0,
	Cycle INT NOT NULL DEFAULT 0,
	Class VARCHAR(20) NOT NULL DEFAULT 'Generic',
	Unit VARCHAR(20) NULL,
	CONSTRAINT FK_config_nodeID FOREIGN KEY (NodeID) REFERENCES db_datawriter.nodes(NodeID),
	CONSTRAINT PK_configID PRIMARY KEY (NodeID, Port)
)
GO