import {
    createDatabase,
    createTables
} from '../services/sqlite3';
import {
    getGists,
    getRawDsaGist,

    insertDsaIntoDb
} from '../services/source';


export async function initalize(
    home: string, 
    dirName: string, 
    dbName: string
) {

    let db = await createDatabase(home + dirName, dbName);
    await createTables(db);

    let gists = await getGists();
    let gist = await getRawDsaGist(gists);

    let dsa = await insertDsaIntoDb(db, gist);

    await createCardsForTopics(db);

};

