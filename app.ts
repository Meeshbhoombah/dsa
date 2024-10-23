import * as https from 'https';


function pprint(s: string) {
    console.log(JSON.stringify(JSON.parse(s), null, 2))
}


const GITHUB_API = 'https://api.github.com/';


/*
// TODO: update endpoint to `/user-agent`

let httpBinRequest = https.get('https://httpbin.org/headers', (res) => {

    res.on('data', (data) => {
        // Looking at the headers of responses from GitHub, the encoding is
        // `latin1`
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
    
    let categories = 0;
    let topics = 0;
   
    for (let line of dsaGist) {
        if (line[0] == '#') {
            console.log('category');
            categories++
        }

        if (line[0] == '-') {
            console.log('topic') 
            topics++
        }


    }

    console.log('Categories: ', categories);
    console.log('Topics: ', topics);
}

parseLines();

