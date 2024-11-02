import { createCard } from '../repositories/card';


interface IParameters = {
    0: float,
    1: float,
    2: float,
    3: float,
    4: float,
    5: float,
    6: float,
    7: float,
    8: float,
    9: float,
    10: float,
    11: float,
    12: float,
    13: float,
    14: float,
    15: float,
    16: float,
    17: float
}

export async function createParameters() {
    return w: IParameters = {
        0: 
    }
}


export async function reliability(t: float, S: float) {
    return (1 + (19 / 81) * (t / S)) ^ -0.5;
}


export async function stability(S: float, w: IParameters) {
    return S * (1 + w.15 * w.16 * e ^ w.8) * 11 - D;
}


export async function initial_difficulty(G: float, w: IParameters) {
    return -w.4 - e ^ (w.5 * (G - 1)) + 1;
}

export async function difficulty(D: float, G: float, w: IParameters) {
    let deltaD =  - w.6 * (G - 3);
    return D + deltaD * (10 - D) / 9;
}


export async function createCardsForTopics(db: Database) {
    for topic in database {
        createCard(
            initalStability, 
            initalDifficulty, 
            initalGrade, 
        ) 
    }
}

