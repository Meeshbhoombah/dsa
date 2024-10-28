import { Database } from 'better-sqlite3';


export async function createCategory(db: Database, name: string) {
    return new Promise((resolve, reject) => {
        let insert = `
            INSERT into categories(
                title 
            ) VALUES (
                @title
            )
        `;

        try {
            resolve(db.prepare(insert).run({ title: name }).lastInsertRowid as number); 
        } catch(e) {
            reject(e);
        }
    });
}

