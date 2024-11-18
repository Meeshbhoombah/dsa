import { Database } from 'better-sqlite3';


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

