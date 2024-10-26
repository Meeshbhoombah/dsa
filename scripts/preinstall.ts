import {
    loadSourceDsaGist
    parseSourceDsaGist
} from '../services/source';
import {
    createDatabase
} from '../services/sqlite3';
import {
    loadRawDsaIntoCategories,
} from '../repositories/categories';
import {
    loadRawDsaIntoTopics
} from '../repositores/topics';


/**
 *
 * Prior to the application's start, we need to:
 *
 * 1. Load the DSA.md source file from GitHub.
 * 2. Parse the DSA.md source file from its loaded state into each category and 
 *    topic.
 * 3. Create a database and directory for the application. This includes adding
 *    the requisite tables to the database.
 * 4. Load each category and topic from the parsed DSA source file into the 
 *    database as an individual record. Each topic should be associated to its 
 *    relevant category.
 * 5. Calculate the days on which each topic needs to be visited.
 *    // Spaced-repitition
 *    // Maximally four topics a day
 *
 */

let gists = getGists();
let rawDsaGist = getRawDsaGist(rawDsaGist);
let [categories, topics] = parseRawDsaGist(rawDsaGist);

let dir = makeAppDir();
let db = createEmptyDatabase(dir);
createDatabaseTables(db);

loadRawDsaIntoDatabase(db, categories, topics);

