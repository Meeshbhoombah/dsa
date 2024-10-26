import fs from 'fs';
import DatabaseConstructor, { Database } from 'better-sqlite3';


const DB_PATH = process.env.HOME + '/.dsa';
const DB_NAME = '/database.db';


async function createDatabase() {
    if (!fs.existsSync(DB_PATH)) {
        fs.mkdir(DB_PATH, (e) => {
            throw e;
        });   
    }

    let db: Database = new DatabaseConstructor(DB_PATH + DB_NAME);
    // Some initialization
    return db;

    console.log(db);
}

