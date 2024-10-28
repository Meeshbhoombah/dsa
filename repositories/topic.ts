import { Database } from 'better-sqlite3';


export async function createTopic(
    db: Database, 
    categoryId: number, 
    name: string
) {
    return new Promise((resolve, reject) => {
        let insert = `
            INSERT into topics(
                category, title
            ) VALUES (
                @category, @title
            )
        `;

        try {
            resolve(db.prepare(insert).run({ 
                category: categoryId, 
                title: name 
            }).lastInsertRowid as number); 
        } catch(e) {
            reject(e);
        }
    });
}
