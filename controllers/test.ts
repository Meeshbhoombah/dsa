import {
    initialDifficulty,
    initialStability,
    retrievability,
    nextRetrievableDay,
    difficulty,
    stability
} from '../services/fsrs';


export async function test() {

    console.log('Topic One');
    let topicOne = {
        rating: 2
    }

    console.log('Initial Rating: ', topicOne.rating);

    let zerothDifficulty = initialDifficulty(topicOne.rating); 
    console.log('Initial Difficulty: ', zerothDifficulty);

    let zerothStability = initialStability(topicOne.rating);
    console.log('Initial Stability: ', zerothStability);

    let zerothRetrievability = retrievability(0, zerothStability);
    console.log('Initial Retrievability: ', zerothRetrievability);

    let daysAfterZeroForRevisit = nextRetrievableDay(zerothStability);
    console.log('Initial next day: ', daysAfterZeroForRevisit);
    
    let ratings = [1, 2, 3, 4];

    let D = zerothDifficulty;
    let S = zerothStability;
    let R = zerothRetrievability;
    let daysSinceLastReview = daysAfterZeroForRevisit;
    let I = daysAfterZeroForRevisit;

    for (let i = 0; i <= 4; i++) {
        // let randomRatingIndex = Math.floor(Math.random() * ratings.length);
        // let G = ratings[randomRatingIndex];
        let G = 2;
        console.log('Next rating: ', G);

        D = difficulty(D, G);
        console.log('Next difficulty: ', D);

        R = retrievability(0, S);
        console.log('Next retrievability: ', R);
        
        S = stability(D, S, G);
        console.log('Next stability: ', S);
        
        I = nextRetrievableDay(S);
        console.log('Increment: ', I);
    }

}


