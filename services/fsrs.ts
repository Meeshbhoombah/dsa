import { Database } from 'better-sqlite3';

import { 
    readAllTopics,
    readTopicById
} from '../repositories/topic';
import { 
    createDayForTopic,
    readDayByDate
} from '../repositories/day';


interface IParameters {
    0: number,
    1: number,
    2: number,
    3: number,
    4: number,
    5: number,
    6: number,
    7: number,
    8: number,
    9: number,
    10: number,
    11: number,
    12: number,
    13: number,
    14: number,
    15: number,
    16: number,
    17: number 
}

export function createParameters() {
    /*
    let w: IParameters = {
        0:
    }

    return w;
    */
}


export async function reliability(t: number, S: number) {
    return (1 + (19 / 81) * (t / S)) ^ -0.5;
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


export async function createInitialTopicDays(db: Database) {
    let topics: any = await readAllTopics(db);

    let date = new Date();
    for (let [_, topic] of topics.entries()) {
        await createDayForTopic(db, topic.id, date);
        date.setDate(date.getDate() + 1);
    }

    return;
}


export async function topicsForDay(db: Database, date: Date) {
    let day: any = await readDayByDate(db, date);
    let topics = JSON.parse(day.topics);

    let topicsForDay = [];
    for (let topic of topics) {
        topicsForDay.push(await readTopicById(db, topic));
    }

    return topicsForDay;
}

