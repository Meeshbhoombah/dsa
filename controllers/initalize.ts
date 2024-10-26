import {
    createDatabase,
    createTables
} from '../services/sqlite3';
import {
    getGists,
    getRawDsaGist,

    parseRawDsaGist
} from '../services/source';
// import { createCategory } from '../repositories/category';


export async function initalize(
    home: string, 
    dirName: string, 
    dbName: string
) {

    let db = await createDatabase(home + dirName, dbName);
    createTables(db);

    let gists = await getGists();
    let gist = await getRawDsaGist(gists);

    let dsaFile = gist.split('\n');
    // We can ignore the first line of the file
    dsaFile.shift()!;

    let dsa: { [key: string]: string[] } = {};
    let category = "";
    for (let line of dsaFile) {
        if (line[0] == '#') {
            category = line.replace(/#/g, '').substring(1);
            dsa[category] = [];
        }

        if (line[0] == '-') {
            let topic = line.substring(6);
            dsa[category].push(topic);
        }
    }

    console.log(dsa);

};

