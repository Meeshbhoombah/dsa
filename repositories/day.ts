import { Database } from 'better-sqlite3';


export async function createDayForTopic(
    db: Database,
    topicId: number, 
    dateOfDay: Date
) {
    return new Promise((resolve, reject) => {
        let create = `
            INSERT into days(
                date, topics
            ) VALUES (
                @date, @topics
            ) 
        `;

        // The aggregated set of topics for a day are each topics id, stored
        // within our database as a `JSON` value
        let topics = JSON.stringify([topicId]);
        let date = dateOfDay.toISOString().split('T')[0];

        try {
            resolve(db.prepare(create).run({
                date,
                topics 
            }));
        } catch(e) {
            reject(e);
        }
    });
}


export async function readDay(
    db: Database, 
    dateOfDay: Date
) {
    return new Promise((resolve, reject) => {
        let read = `
            SELECT _id, date, topics
            FROM days
            WHERE date = ?
        `;
        
        let date = dateOfDay.toISOString().split('T')[0];

        try {
            resolve(db.prepare(read).get(date));
        } catch (e) {
            reject(e);
        }
    });
}

