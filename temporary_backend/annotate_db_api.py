from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

# Database connection configuration
db_config = {
    'user': 'user',
    'password': 'password',
    'host': '127.0.0.1',
    'database': 'annotationdb',
}


class CellState(BaseModel):
    CellID: int = None  # Auto-incremented
    timestamp: datetime
    ContentID: int
    UserID: int
    # Location coordinates
    x: float
    y: float
    z: float


# Function to get a database connection
def get_db_connection():
    return mysql.connector.connect(**db_config)


# API route to create a new cell state
@app.post("/new_cell_state/")
def create_cell_state(cell_state: CellState):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO cell_state (timestamp, ContentID, UserID, x, y, z) VALUES (%s, %s, %s, %s, %s, %s)",
                   (cell_state.timestamp, cell_state.ContentID, cell_state.UserID, cell_state.x, cell_state.y, cell_state.z))
    conn.commit()
    cell_state.CellID = cursor.lastrowid
    cursor.close()
    conn.close()
    return cell_state


# Get a cell state by ID
@app.get("/cell_state/{cell_id}")
def get_cell_state_by_id(cell_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cell_state WHERE CellID = %s", (cell_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="CellState not found")
    return CellState(CellID=row[0], timestamp=row[1], ContentID=row[2], UserID=row[3])


@app.get("/cell_state/location/")
def get_cell_states_by_location_xy(x: float, y: float, tolerance: float = 0.5):
    return get_cell_states_by_location_from_database(x, y, tolerance)


@app.put("/cell_state/{cell_id}")
def update_cell_state(cell_id: int, updated_cell_state: CellState):
    # Check if the cell state with the given CellID exists
    existing_cell_state = get_cell_state_by_id(cell_id)
    if existing_cell_state is None:
        raise HTTPException(status_code=404, detail="CellState not found")

    # Update the fields with the new values
    existing_cell_state.timestamp = updated_cell_state.timestamp
    existing_cell_state.ContentID = updated_cell_state.ContentID
    existing_cell_state.UserID = updated_cell_state.UserID

    update_cell_state_in_database(existing_cell_state)

    return existing_cell_state


def update_cell_state_in_database(cell_state: CellState):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE cell_state SET timestamp = %s, ContentID = %s, UserID = %s WHERE CellID = %s",
        (cell_state.timestamp, cell_state.ContentID, cell_state.UserID, cell_state.CellID)
    )
    conn.commit()
    cursor.close()
    conn.close()


def get_cell_states_by_location_from_database(x: float, y: float, tolerance: float):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT * FROM cell_state 
        WHERE ABS(x - %s) <= %s AND ABS(y - %s) <= %s
    """
    cursor.execute(query, (x, tolerance, y, tolerance))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    cell_states = []
    for row in rows:
        cell_states.append(CellState(CellID=row[0], timestamp=row[1], ContentID=row[2], UserID=row[3], x=row[4], y=row[5], z=row[6]))

    if not cell_states:
        raise HTTPException(status_code=404, detail="No CellState found for the given location")

    return cell_states


# Delete a cell state by CellID
@app.delete("/cell_state/{cell_id}")
def delete_cell_state(cell_id: int):
    # Check if the cell state with the given CellID exists
    existing_cell_state = get_cell_state_by_id(cell_id)
    if existing_cell_state is None:
        raise HTTPException(status_code=404, detail="CellState not found")

    # Delete the record from the database
    delete_cell_state_from_database(cell_id)

    return {"message": "CellState deleted successfully"}


def delete_cell_state_from_database(cell_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cell_state WHERE CellID = %s", (cell_id,))
    conn.commit()
    cursor.close()
    conn.close()


# get all Cell States as cell state objects with a given ContentID
@app.get("/cell_state/content/{content_id}")
def get_cell_state_by_content_id(content_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cell_state WHERE ContentID = %s", (content_id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    cell_states = []
    for row in rows:
        cell_states.append(CellState(CellID=row[0], timestamp=row[1], ContentID=row[2], UserID=row[3]))

    if not cell_states:
        raise HTTPException(status_code=404, detail="CellState not found")

    return cell_states


# get all Cell States JSON objects with a given UserID
@app.get("/cell_state/user/{user_id}")
def get_cell_state_by_user_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cell_state WHERE UserID = %s", (user_id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    cell_states = []
    for row in rows:
        cell_states.append(CellState(CellID=row[0], timestamp=row[1], ContentID=row[2], UserID=row[3]))

    if not cell_states:
        raise HTTPException(status_code=404, detail="CellState not found")

    return cell_states

# get all Cell States JSON objects
@app.get("/cell_state/")
def get_all_cell_states():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cell_state")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    cell_states = []
    for row in rows:
        cell_states.append(CellState(CellID=row[0], timestamp=row[1], ContentID=row[2], UserID=row[3]))

    if not cell_states:
        raise HTTPException(status_code=404, detail="CellState not found")

    return cell_states


# Execute custom queries on cell states
@app.get("/cell_state/custom_query/")
def custom_query_cell_states(query: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Execute the custom query
        cursor.execute(query)
        rows = cursor.fetchall()

        cell_states = []
        for row in rows:
            cell_states.append(CellState(CellID=row[0], timestamp=row[1], ContentID=row[2], UserID=row[3]))

        if not cell_states:
            raise HTTPException(status_code=404, detail="No CellStates found for the custom query")

        return cell_states
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Custom query error: {str(e)}")
    finally:
        cursor.close()
        conn.close()



