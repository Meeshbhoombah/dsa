import { prompt } from 'enquirer';

import { Topic, PromptResult } from '../types';

import { convertLocaleDateToSqlDate } from '../utils/date';

import { createDatabase } from '../services/sqlite3';
import { topicsForDay } from '../services/source';
import { schedule } from '../services/fsrs';


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
                { name: 'A', message: 'Again' },
                { name: 'H', message: 'Hard' },
                { name: 'G', message: 'Good' },
                { name: 'E', message: 'Easy' },
            ],
            margin: [0.5, 1, 2, 1],
            choices
        }
    ];
    
    prompt(topicsDisplay) 
        .then((topicsWithRatings) => schedule(
                                        db, 
                                        topicsWithRatings as PromptResult,
                                        date
                                     )
             );
   
}

