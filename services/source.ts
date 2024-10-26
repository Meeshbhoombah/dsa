import * as https from 'https';


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


async function getGists(url: string) {
    let rawGistsString = await get(url);
    let gists = JSON.parse(rawGistsString);
    return gists;
}


async function getRawDsaGist(gists: object) {
    for (let [_, gist] of Object.entries(gists)) {
        if (gist.files['DSA.md']) {
            let rawDsaGist = await get(gist.files['DSA.md'].raw_url);
            return rawDsaGist;
        }
    }

    throw new Error('Gist: DSA.md not found');
}


async function parseRawDsaGist(rawDsaGist: string): Promise<[string[], string[]]> {
    return new Promise((_, resolve) => {
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

        resolve([categories, topics]);
    });
}

