import fs from 'fs';
import DatabaseConstructor, { Database } from 'better-sqlite3';


const DB_PATH = process.env.HOME + '/.dsa';
const DB_NAME = '/database.db';


async function createDatabase(path: string, name: string): Promise<Database> {
    if (!fs.existsSync(path)) {
        fs.mkdir(path, (e) => {
            throw e;
        });   
    }

    let db: Database = new DatabaseConstructor(path + name);
    return db;
}


async function createTable(database: Database, query: string) {
    try {
        database.prepare(query).run();
    } catch (e) {
        console.error(e);
    }
}

async function createTables(db: Database) {
    let tables = [];

    // We use `sha256` as a the file checksum because...
    // https://security.stackexchange.com/questions/198631/which-hashing-algorithm-shoud-i-use-for-a-safe-file-checksum
    tables.push(`
        CREATE TABLE metadatas(
            date        DATETIME,
            changed     BOOLEAN, 
            checksum    BINARY(32)
        )
    `);

    tables.push(`
        CREATE TABLE categories(
            _id         INT PRIMARY KEY,
            title       VARCHAR(100),
            topics      JSON
        )
    `);

    tables.push(`
        CREATE TABLE topics(
            _id         INT PRIMARY KEY,
            category    INT,
            title       VARCHAR(100),
            days        JSON,

            FOREIGN KEY (category) REFERENCES categories (_id)
        )
    `);

    tables.forEach((t) => {
        createTable(db, t);
    })
}

