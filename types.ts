export interface PromptResult {
    completion: object
}


export interface Day {
    id: number;
    date: string,
    topics: string
}


export interface Topic {
    id: number,
    category: number,
    title: string,
    reviews: number
}


export interface Card {
    id: number,
    for: number,
    date: string,
    stability: number,
    retrievability: number,
    difficulty: number
}

