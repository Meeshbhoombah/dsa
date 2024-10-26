import * as https from 'https';


function pprint(s: string) {
    console.log(JSON.stringify(JSON.parse(s), null, 2))
}


const GITHUB_API = 'https://api.github.com/';


/*
// TODO: update endpoint to `/user-agent`

let httpBinRequest = https.get('https://httpbin.org/headers', (res) => {

    res.on('data', (data) => {
        console.log(data.toString());
    });

});
*/


async function get(url: string) {
    return new Promise<string>((resolve, reject) => {
        let options = {
            headers: {
                'Accept' : 'application/vnd.github+json',
                'Authorization' : 'Bearer ' + process.env.GITHUB_FINE_GRAINED_TOKEN,
                'X-GitHub-Api-Version' : '2022-11-28',
                'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
            }
        }
  
        https.get(url, options, (res) => {
            let raw: string = "";
            res.on('data', (d) => {
                // GitHub uses `latin1` encoding
                raw += d.toString('latin1');
            });

            res.on('end', () => {
                resolve(raw);
            });

            res.on('error', (e) => {
                reject(e) 
            });
        });
    });
}

async function getGists() {
    let rawGistsString = await get(GITHUB_API + 'gists');
    let gists = JSON.parse(rawGistsString);
    return gists;
}

async function getRawDsaGist() {
    let gists = await getGists();
    for (let gist of gists) {
        if (gist.files['DSA.md']) {
            let rawDsaGist = await get(gist.files['DSA.md'].raw_url);
            return rawDsaGist;
        }
    }

    throw new Error('Gist: DSA.md not found');
}


async function parseLines() {
    let rawDsaGist = await getRawDsaGist();
    let dsaGist = rawDsaGist.split('\n');
  
    let categories = [];
    let topics = [];

    for (let line of dsaGist) {
        if (line[0] == '#') {
            categories.push((line.replace(/#/g, '')).substring(1));
        }

        if (line[0] == '-') {
            topics.push(line.substring(6));
        }
    }
}


const DB_PATH = process.env.HOME + '/.dsa';
const DB_NAME = '/database.db';


import fs from 'fs';
import DatabaseConstructor, { Database } from 'better-sqlite3';


async function createDatabase(): Promise<Database> {
    if (!fs.existsSync(DB_PATH)) {
        fs.mkdir(DB_PATH, (e) => {
            throw e;
        });   
    }

    let db: Database = new DatabaseConstructor(DB_PATH + DB_NAME);
    return db;
}

async function createTable(database: Database, query: string) {
    try {
        database.prepare(query).run();
    } catch (e) {
        console.error(e);
    }
}


async function initalizeAppTables(db: Database) {
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

