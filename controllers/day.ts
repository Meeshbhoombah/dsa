import { createDatabase } from '../services/sqlite3';
import { topicsForDay } from '../services/fsrs';


export async function day(
    home: string, 
    dirName: string, 
    dbName: string
) {

    let date = new Date();

    let db = await createDatabase(home + dirName, dbName);

    let topics = await topicsForDay(db, date);


}

