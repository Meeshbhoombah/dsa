import * as https from 'https';


console.log(process.env.GITHUB_FINE_GRAINED_TOKEN);


function pprint(s: string) {
    console.log(JSON.stringify(JSON.parse(s), null, 2))
}


/*
let httpBinRequest = https.get('https://httpbin.org/headers', (res) => {

    res.on('data', (data) => {
        // Looking at the headers of responses from GitHub, the encoding is
        // `latin1`
        console.log(data.toString());
    });

});
*/


let options = {
    headers: {
        'Accept' : 'application/vnd.github+json',
        'Authorization' : 'Bearer ' + process.env.GITHUB_FINE_GRAINED_TOKEN,
        'X-GitHub-Api-Version' : '2022-11-28',
        'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    }
}

let req = https.get('https://api.github.com/gists', options, (res) => {

    let raw: string = "";

    res.on('data', (data) => {
        // Looking at the headers of responses from GitHub, the encoding is
        // `latin1`
        raw += data.toString('latin1');

    });

    res.on('end', () => {
  
        let gists = JSON.parse(raw);
        for (let gist of gists) {
            if (gist.files['DSA.md']) {
                console.log(gist);
            }
        }
   
    });
    

});

