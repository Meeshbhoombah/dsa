import * as https from 'https';

import { Database } from 'better-sqlite3';

import { createCategory } from '../repositories/category';
import { createTopic } from '../repositories/topic';


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


export async function getGists() {
    try {
        let rawGistsString = await get(GITHUB_API + 'gists');
        let gists = JSON.parse(rawGistsString);
        return gists;
    } catch(e) {
        console.error(e);
    }
}

export async function getRawDsaGist(gists: object) {
    for (let [_, gist] of Object.entries(gists)) {
        if (gist.files['DSA.md']) {
            let rawDsaGist = await get(gist.files['DSA.md'].raw_url);
            return rawDsaGist;
        }
    }

    throw new Error('Gist: DSA.md not found');
}


export async function insertDsaIntoDb(db: Database, rawDsaFile: string) {
    let dsaFile = rawDsaFile.split('\n');
    // We can ignore the first line of the file
    dsaFile.shift()!;

    let category = "";
    let categoryId = 0;
    for (let line of dsaFile) {
        if (line[0] == '#') {
            let category = line.replace(/#/g, '').substring(1);
            categoryId = await createCategory(db, category) as number; 
        }

        if (line[0] == '-') {
            let topic = line.substring(6);
            await createTopic(db, categoryId, topic);
        }
    }
}

