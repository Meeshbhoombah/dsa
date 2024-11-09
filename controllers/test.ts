import {
    initialDifficulty,
    retrievability,
    initialStability
} from '../services/fsrs';


export async function test() {

    console.log('Topic One');
    let topicOne = {
        rating: 1
    }


    let zeroThDifficulty = initialDifficulty(topicOne);
    let zeroThStability = initialStability(topicOne);
    let zeroThRetrievability = retrievability(topicOne);


    console.log('Initial Difficulty: ', zeroThDifficulty);

}


