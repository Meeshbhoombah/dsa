import {
    createDatabase,
    createTables
} from '../services/sqlite3';
import {
    getGists,
    getRawDsaGist,

    insertDsaIntoDb
} from '../services/source';
import { 
    createInitialTopicDays,
} from '../services/fsrs';


export async function initalize(
    home: string, 
    dirName: string, 
    dbName: string
) {

    let db = await createDatabase(home + dirName, dbName);
    await createTables(db);

    let gists = await getGists();
    let gist = await getRawDsaGist(gists);
    await insertDsaIntoDb(db, gist);

    await createInitialTopicDays(db);

    return;

};

