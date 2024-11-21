import { Database } from 'better-sqlite3';

export function createCard(
    db: Database,
    topicId: number,
    date: string,
    grade: number,
    difficulty: number,
    retrievability: number,
    stability: number
) {
    return new Promise((resolve, reject) => {
        let create = `
            INSERT into cards(
                for, date, grade, difficulty, retrievability, stability
            ) VALUES (
                @for, @date, @grade, @difficulty, @retrievability, @stability 
            )
        `;

        try {
            resolve(db.prepare(create).run({
                for: topicId,
                date,
                grade,
                difficulty,
                retrievability,
                stability 
            }).lastInsertRowid as number);
        } catch(e) {
            reject(e);
        }
    });
}


export async function readMostRecentCardByTopicId(db: Database, topicId: number) {
    let read = `
        SELECT _id as id, for, date, stability, retrievability, difficulty
        FROM cards
        WHERE for = ?
        ORDER BY date DESC
    `

    try {
        return db.prepare(read).get(topicId);
    } catch(e) {
        console.error(e);
        return;
    }
}

