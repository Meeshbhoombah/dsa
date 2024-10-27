import { Database, SqliteError } from 'better-sqlite3';


export async function createCategory(db: Database, name: string): Promise<number> {
    return new Promise((reject, resolve) => {
        let insert = `
            INSERT into categories(
                title 
            ) VALUES (
                @title
            )
        `;

        try {
            resolve(db.prepare(insert).run({ title: name }).lastInsertRowid); 
        } catch(e) {
            reject(e);
        }
    });
}

