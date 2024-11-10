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


/**
 *
 * Calculates the retrievability for a topic at a particular time
 *
 * @param {number} t - Days since last review of a topic
 * @param {number} S - Stability
 *
 */
export function retrievability(t: number, S: number) {
    return (1 + (19 / 81) * t / S) ^ -0.5;
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
export function nextRetrievableDay(r: number, S: number) {
    let i = (S / (19 / 81)) * ((r ^ (1 / -0.5)) - 1);
    return Math.max(Math.round(i), 1);
}


export function initialStability(rating: number) {
    return W[rating - 1];
}

export function stability(
    D: number,
    S: number,
    R: number,
    G: number
) {
    return S * (Math.E ^ W[8] * (11 - D) * S ^ -W[9] * (Math.E ^ (W[10] * (1 - R) - 1)) + 1);
}


export function initialDifficulty(rating: number) {
    return W[4] - Math.E ^ (W[5] * (rating - 1)) + 1;
}

export function difficulty(
    G: number, 
    D: number
) {
    let deltaD = - W[6] * (G - 3);
    let dPrime = D + deltaD * (10 - D) / 9;
    return W[7] * initialDifficulty(4) + (1 - W[7]) * dPrime;
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
    // Our imported package "Enquirer" returns the results of a prompt behind 
    // some object, in this casse the PromptResult is behind `completion`
    let topics = topicsDisplayResult.completion;
    console.log(topics);

    // TODO:increment the rating by one to match the scale for FSRS

    /*
    for (let [topicId, rating] of Object.entries(topics)) {
        let topic = await readTopicById(db, parseInt(topicId)) as Topic;
        
        // TODO: add field for days since last review
        // TODO: add field for count of reviews, starting at 0 always
        let difficulty = 0;
        let retrievability = 0;
        let stability = 0;
        
        // '0th' review
        if (topic.reviews == 0) {
            difficulty = initialDifficulty(rating);
            stability = initialStability(rating);
            // Because this is the first time a card has been visited, its days
            // since last review are 0, thus we can calculate the inital 
            // retrievabilty of a card consistently by using the constant 0
            retriability = retrivability(stability, 0)
            // TODO add scheduling for next card

        }

        // '1st' review
        if (topic.review >= 1) {
            let lastCard = await readLastCardForTopic(topicId);

            difficulty = difficulty(rating);
           
            let daysSinceLastReview = dayDifference(date, lastCard.date);
            retrievability = (daysSinceLastReview, lastCard.stability);

            stability = stability(lastCard.stability, difficulty, retrievability, rating);
        }
            
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
    }
   */
}

