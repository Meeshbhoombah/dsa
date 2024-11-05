import { Database } from 'better-sqlite3';

import { Topic } from '../types';

import { incrementDate } from '../utils/date';

import { 
    readAllTopics,
    readTopicById
} from '../repositories/topic';
import { 
    createDayForTopic,
    readDayByDate
} from '../repositories/day';


const W = [
    0.40255, 
    1.18385, 
    3.173, 
    15.69105, 
    7.1949, 
    0.5345, 
    1.4604, 
    0.0046, 
    1.54575, 
    0.1192, 
    1.01925, 
    1.9395, 
    0.11, 
    0.29605, 
    2.2698, 
    0.2315, 
    2.9898, 
    0.51655, 
    0.6621
];


export async function retrievability(t: number, S: number) {
    return (1 + (19 / 81) * (t / S)) ^ -0.5;
}


function initialStability(rating: number) {
    return W[rating];
}

export async function stability(
    S: number, 
    w15: number, 
    w16: number,
    e: number,
    w8: number,
    D: number
) {
    return S * (1 + w15 * w16 * e ^ w8) * 11 - D;
}


export async function initialDifficulty(
    G: number,
    e: number,
    w4: number,
    w5: number,
) {
    return -w4 - e ^ (w5 * (G - 1)) + 1;
}

export async function difficulty(
    G: number, 
    w6: number, 
    D: number
) {
    let deltaD =  - w6 * (G - 3);
    return D + deltaD * (10 - D) / 9;
}


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


export interface PromptResult {
    completion: object
}

export async function schedule(db: Database, topicsDisplayResult: PromptResult) {
    let topics = topicsDisplayResult.completion;

    for (let [topicId, rating] of Object.entries(topics)) {
        let topic = await readTopicById(db, parseInt(topicId)) as Topic;

        if (topic.stability == null) {
            let initialStabilityForTopic = initialStability(rating);
            console.log(initialStabilityForTopic);
            console.log(await retrievability(1, initialStabilityForTopic));

        }
        
        // TODO: add field for days since last review
        // TODO: add field for count of reviews, starting at 1 always
        
        /*
        // '0th' review
        if (topic.daysSinceReview == 0) {
            let difficulty = initialDifficulty(rating);
            let stability = initialStability(rating);
            // Because this is the first time a card has been visited, its days
            // since last review are 0, thus we can calculate the inital 
            // retrievabilty of a card consistently by using the constant 0
            let retriability = retrivability(stability, 0)
            let dayIncrement = nextRetrievableDay(retrievability, stability);
        }

        // '1st' review
        if (topic.review >= 1) {
            let retriability = 
        }
        */
    }
}

