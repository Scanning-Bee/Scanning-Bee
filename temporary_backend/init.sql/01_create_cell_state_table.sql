CREATE TABLE IF NOT EXISTS cell_state (
    CellID INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP,
    ContentID INT,
    UserID INT
);
