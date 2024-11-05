import { prompt } from 'enquirer';

import { 
    convertLocaleDateToSqlDate
} from '../utils/date';

import { createDatabase } from '../services/sqlite3';
import { 
    PromptResult,

    topicsForDay,
    schedule
} from '../services/fsrs';


interface Topic {
    id: number,
    category: number,
    title: string
}


export async function day(
    home: string, 
    dirName: string, 
    dbName: string
) {

    let date = Date();

    let db = await createDatabase(home + dirName, dbName);

    let topics = await topicsForDay(db, date);

    let choices: any = [];
    for (let topic of topics) {
        let t = topic as Topic;
        choices.push({
            name: t.id,
            message: t.title 
        });
    }
   
    
    let topicsDisplay = [
        {
            type: 'scale',
            name: 'completion',
            message: 'Topics',
            scale: [
                { name: '1', message: 'Hard' }, 
                { name: '2', message: 'Good' },
                { name: '3', message: 'Easy' },
                { name: '4', message: 'Again' },
            ],
            margin: [0.5, 1, 2, 1],
            choices
        }
    ];
    
    prompt(topicsDisplay) 
        .then((topicsWithRatings) => schedule(topicsWithRatings as PromptResult));
   
}

