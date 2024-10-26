import {
    createDatabase,
    createTables
} from '../services/sqlite3';
import {
    getGists,
    getRawDsaGist,

    parseRawDsaGist
} from '../services/source';


export async function initalize(
    home: string, 
    dirName: string, 
    dbName: string
) {

    let db = await createDatabase(home + dirName, dbName);
    createTables(db);

    

};

