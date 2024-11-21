import * as https from 'https';

import { Database } from 'better-sqlite3';

import { incrementDate } from '../utils/date';

import { createCategory } from '../repositories/category';
import { 
    createTopic,

    readAllTopics,
    readTopicById
} from '../repositories/topic';
import { 
    createDayForTopic,

    readDayByDate
} from '../repositories/day';


const GITHUB_API = 'https://api.github.com/';


/*
// TODO: update endpoint to `/user-agent`

let httpBinRequest = https.get('https://httpbin.org/headers', (res) => {

    res.on('data', (data) => {
        console.log(data.toString());
    });

});
*/


function get(url: string) {
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

    return;
}


// TODO: move these to a seperate file for topics, `topics.ts`?
export async function createInitialTopicDays(db: Database, date: string) {
    let topics: any = await readAllTopics(db);

    for (let [_, topic] of topics.entries()) {
        await createDayForTopic(db, topic.id, date);
        date = incrementDate(date);
    }

    return;
}


export async function topicsForDay(db: Database, date: string) {
    let day: any = await readDayByDate(db, date);
    let topics = JSON.parse(day.topics);

    let topicsForDay = [];
    for (let topic of topics) {
        topicsForDay.push(await readTopicById(db, topic));
    }

    return topicsForDay;
}


const LEETCODE_API = 'https://leetcode.com/graphql/';


// A hybrid GraphQL/JSON query is made by Leetcode to get the Top 150 interview
// questions
const LEETCODE_TOP_150_QUERY = `{ "query": "query studyPlanDetail($slug: String!) {
    studyPlanV2Detail(planSlug: $slug) {
        slug
        name
        highlight
        staticCoverPicture
        colorPalette
        threeDimensionUrl
        description
        premiumOnly
        needShowTags
        awardDescription
        defaultLanguage
        award {
            name
            config {
                icon
                iconGif
                iconGifBackground
            }
        }
        relatedStudyPlans {
            cover
            highlight
            name
            slug
            premiumOnly
        }
        planSubGroups {
            slug
            name
            premiumOnly
            questionNum
            questions {
                translatedTitle
                titleSlug
                title
                questionFrontendId
                paidOnly
                id
                difficulty
                hasOfficialSolution
                topicTags {
                    slug
                    name
                }
                solutionInfo {
                    solutionSlug
                    solutionTopicId
                }
            }
        }
    }
}",
"variables" : { "slug" : "top-interview-150" }, 
"operationName" : "studyPlanDetail" 
}`

const LEETCODE_TOP_150_QUERY_2 = {
    query: `query studyPlanDetail($slug: String!) {
        studyPlanV2Detail(planSlug: $slug) {
            slug
            name
            highlight
            staticCoverPicture
            colorPalette
            threeDimensionUrl
            description
            premiumOnly
            needShowTags
            awardDescription
            defaultLanguage
            award {
                name
                config {
                    icon
                    iconGif
                    iconGifBackground
                }
            }
            relatedStudyPlans {
                cover
                highlight
                name
                slug
                premiumOnly
            }
            planSubGroups {
                slug
                name
                premiumOnly
                questionNum
                questions {
                    translatedTitle
                    titleSlug
                    title
                    questionFrontendId
                    paidOnly
                    id
                    difficulty
                    hasOfficialSolution
                    topicTags {
                        slug
                        name
                    }
                    solutionInfo {
                        solutionSlug
                        solutionTopicId
                    }
                }
            }
        }
    }`,
    variables: { slug: "top-interview-150" },
    operationName: "studyPlanDetail"
};

function postLeetcode(url: string, body: object) {
    return new Promise((resolve, reject) => {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer' : 'https://github.com/Meeshbhoombah/dsa'           
            }
        }
       
        let req = https.request(url, options, (res) => {
            let raw: string = "";
            res.on('data', (d) => {
                raw += d.toString('utf-8');
            });

            res.on('end', () => {
                resolve(raw);
            });

            res.on('error', (e) => {
                reject(e) 
            });

        });

        req.write(JSON.stringify(body));

        req.on('error', (e) => {
            reject(e);
        });

        req.end();

    });
}

export async function getLeetcodeTop150() {
    let response = await postLeetcode(LEETCODE_API, LEETCODE_TOP_150_QUERY_2) as string;
    console.log(JSON.stringify(JSON.parse(response), null, 2));
}

