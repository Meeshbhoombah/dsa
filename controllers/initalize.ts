import {
    createDatabase,
    createTables
} from '../services/sqlite3';
import {
    getGists,
    getRawDsaGist,
    getLeetcodeTop150,

    insertDsaIntoDb,

    createInitialTopicDays
} from '../services/source';


export async function initalize(
    home: string, 
    dirName: string, 
    dbName: string
) {
    
    let db = await createDatabase(home + dirName, dbName);
    await createTables(db);

    let gists = await getGists();
    let gist = await getRawDsaGist(gists!);
    await insertDsaIntoDb(db, gist!);

    // TODO: remove hardcoded date for public release
    let date = `Tue Nov 03 2024 01:08:57 GMT-0500 (Eastern Standard Time)` // Date();
    await createInitialTopicDays(db, date);

    return;

};

