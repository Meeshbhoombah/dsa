import { Database } from 'better-sqlite3';


export async function createTopic(
    db: Database, 
    categoryId: number, 
    name: string
) {
    return new Promise((resolve, reject) => {
        let create = `
            INSERT into topics(
                category, title
            ) VALUES (
                @category, @title
            )
        `;

        try {
            resolve(db.prepare(create).run({ 
                category: categoryId, 
                title: name 
            }).lastInsertRowid as number); 
        } catch(e) {
            reject(e);
        }
    });
}


// TODO add categories to read
export async function readAllTopics(
    db: Database
) {
    return new Promise((resolve, reject) => {
        let read = `
            SELECT _id as id, title
            FROM topics
       `; 

        try {
            resolve(db.prepare(read).all()); 
        } catch (e) {
            reject(e);
        }
    });
}

export async function readTopicById(
    db: Database,
    id: number
) {
    return new Promise((resolve, reject) => {
        let read = `
            SELECT _id as id, category, title
            FROM topics
            WHERE _id = ?
        `
    
        try {
            resolve(db.prepare(read).get(id));
        } catch(e) {
            reject(e);
        }
    });
}

