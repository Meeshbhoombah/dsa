import fs from 'fs';

import { Command } from 'commander';
import { Fonts } from 'figlet';
import * as figlet from 'figlet';
import { prompt } from 'enquirer';

import { initalize } from './controllers/initalize';


async function main() {
    const program = new Command();

    program
        .name('dsa')
        .description(`A command-line utility for managing the learning of data 
                     structures and algorithms`)
        .version('0.0.0')


    const HOME          = process.env.HOME!;
    const DIR_NAME      = '/.dsa';
    const DB_NAME       = 'database.db';


    if (!fs.existsSync(HOME + DIR_NAME)) {
        initalize(HOME, DIR_NAME, DB_NAME);
    }

    
    console.log(
        figlet.textSync('dsa', {
            font: 'Isometric1',
        })
    );

    // day();

}

main();

