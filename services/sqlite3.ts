import fs from 'fs';
import DatabaseConstructor, { Database } from 'better-sqlite3';


const DB_PATH = process.env.HOME + '/.dsa';
const DB_NAME = '/database.db';


export async function createDatabase(path: string, name: string): Promise<Database> {
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

export async function createTables(db: Database) {
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
            _id         INTEGER PRIMARY KEY AUTOINCREMENT,
            title       VARCHAR(200) UNIQUE,
            topics      JSON
        )
    `);

    tables.push(`
        CREATE TABLE topics(
            _id         INTEGER PRIMARY KEY AUTOINCREMENT,
            category    INTEGER,
            title       VARCHAR(100),
            reviews     INTEGER DEFAULT 0,
            cards       JSON,

            FOREIGN KEY (category) REFERENCES categories (_id)
        )
    `);

    tables.push(`
        CREATE TABLE days(
            _id         INTEGER PRIMARY KEY AUTOINCREMENT,
            date        DATE UNIQUE,
            topics      JSON
        )
    `);

    tables.push(`
        CREATE TABLE cards(
            _id                 INTEGER PRIMARY KEY AUTOINCREMENT,
            for                 INTEGER,
            date                DATE UNIQUE,
            stability           DECIMAL(100, 50), 
            retrievability      DECIMAL(100, 50),
            difficulty          DECIMAL(100, 50),
            rating              INTEGER,

            FOREIGN KEY (for) REFERENCES topics (_id) 
        )
    `);

    tables.forEach((t) => {
        createTable(db, t);
    })
}

