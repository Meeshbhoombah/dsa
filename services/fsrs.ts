import { Database } from 'better-sqlite3';

import { 
    Topic,
    Card
} from '../types';

import { 
    incrementDate,
    convertLocaleDateToSqlDate,
    dayDifference,
} from '../utils/date';

import { 
    readAllTopics,
    readTopicById
} from '../repositories/topic';
import { 
    createDayForTopic,
    readDayByDate
} from '../repositories/day';
import {
    readMostRecentCardByTopicId
} from '../repositories/card';


const DECAY = -0.5;
const FACTOR = 0.9 ** (1 / DECAY) - 1;
const REQUEST_RETENTION = 0.9;

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


/**
 *
 * Calculates the retrievability for a topic at a particular time
 *
 * @param {number} t - Days since last review of a topic
 * @param {number} S - Stability
 *
 */
export function retrievability(t: number, S: number) {
    return (1 + FACTOR * t / S) ** DECAY;
}

/**
 *
 * Calculates the next day a topic should be retrieved
 *
 * @param {number} r - Retrievability
 * @param {number} S - Stability
 *
 * @returns {number} The number of days from now that a topic should should be 
 *                   reviewed 
 *
 */
export function nextRetrievableDay(S: number) {
    let i = S / FACTOR * (REQUEST_RETENTION ** (1 / DECAY) - 1);
    return Math.max(Math.round(i), 1);
}


export function initialStability(rating: number) {
    return Math.max(W[rating - 1], 0.1);
}

function shortTermStability(
    D: number, 
    S: number,
    R: number
) {
    let a = W[11];
    let b = D ** -W[12];
    let c = ((S + 1) ** W[13]) - 1;
    let d = Math.exp((1 - R) * W[14]);

    return a * b * c * d;
}

export function nextRecallStability(
    D: number,
    S: number,
    R: number,
    rating: number
) {
    if (rating == 1) {
        return shortTermStability(D, S, R);
    }

    let b = 11 - D;
    let c = S ** W[9];
    let d = Math.exp((1 - R) * W[10] - 1);

    // Hard penalty
    let e = 1;
    if (rating == 2) {
        e = W[15]; 
    }

    // Easy bonus
    let f = 1;
    if (rating == 4) {
        f = W[16];
    }

    return S * (1 + Math.exp(W[8]) * b * c * d * e * f)
}

export function stability(S: number, rating: number) {
    return S * Math.exp(W[17] * (rating - 3 + W[18]));
}


export function initialDifficulty(rating: number) {
    return Math.min(Math.max((W[4] - Math.exp(W[5] * (rating - 1))) + 1, 1), 10);
}

function meanReversion(previousD: number, currentD: number) {
    return W[7] * previousD + (1 - W[7]) * currentD;
}

export function difficulty(rating: number, D: number) {
    let deltaD = D - W[6] * (rating - 3);
    return Math.min(Math.max(meanReversion(initialDifficulty(4), deltaD), 1), 10);
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


// TODO: move PrompResult to types.ts
export interface PromptResult {
    completion: object
}

// TODO: add date to function
export async function schedule(
    db: Database, 
    topicsDisplayResult: PromptResult,
    date: string
) {
    // Our imported package "Enquirer" returns the results of a prompt behind 
    // some object, in this casse the PromptResult is behind `completion`
    let topics = topicsDisplayResult.completion;
    date = convertLocaleDateToSqlDate(date);

    for (let [topicId, rating] of Object.entries(topics)) {
        // Values passed to the scheduling function by `dsa` are 0-indexed, to
        // match the FSRS algorithm specficiation we must increment ratings by 1
        rating += 1;

        let topic = await readTopicById(db, parseInt(topicId)) as Topic;
        
        let D = 0;
        let R = 0;
        let S = 0;
      
        // '0th' review
        if (topic.reviews == 0) {
            D = initialDifficulty(rating);
            S = initialStability(rating);
            // Because this is the first time a card has been visited, its days
            // since last review are 0, thus we can calculate the inital 
            // retrievabilty of a card consistently by using the constant 0
            R = retrievability(0, S);
        }

        if (topic.reviews >= 1) {
            let lastCard = await readMostRecentCardByTopicId(db, topic.id) as Card;
           
            D = difficulty(lastCard.difficulty, rating);

            let daysSinceLastReview = dayDifference(lastCard.date, date);
            // R = retrievability(daysSinceLastReview, lastCard.stability);

            S = stability(lastCard.stability, rating);
        }
        
        /*    
        dayIncrement = nextRetrievableDay(retrievability, stability);

        // TODO: add `incrementDateByNumberOfDays` to date util
        let nextTopicReviewDate = incrementDateByNumberOfDays(dayIncrement, date);
        // TODO: add `readDayByDate` to day repository
        let day = await readDayByDate(nextTopicReviewDate);
        day.topics.push(topicId);
        // TODO: add `updateTopicsForDay` to day repository
        await updateTopicsForDay(day);

        await createCard(
            topicId,
            date, 
            rating, 
            difficulty, 
            retrievability, 
            stability
        );
        */
    }
}
