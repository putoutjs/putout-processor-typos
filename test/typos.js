import {createTest} from '@putout/test/processor';
import * as typos from '../lib/typos.js';

const test = createTest(import.meta.url, {
    extension: 'md',
    processorRunners: [
        typos,
    ],
});

test('putout: processor: typos', async ({process}) => {
    await process('typos');
});

test('putout: processor: typos: one', async ({process}) => {
    await process('one');
});

test('putout: processor: typos: no-error', async ({noProcess}) => {
    await noProcess('no-error');
});

test('putout: processor: typos: empty', async ({noProcess}) => {
    await noProcess('empty');
});

test('putout: processor: typos: places', async ({comparePlaces}) => {
    await comparePlaces('typos', [{
        message: 'Typo: taget -> target',
        position: {
            column: 0,
            line: 1,
        },
        rule: 'typo (typos)',
    }, {
        message: 'Typo: stting -> string,setting,sitting',
        position: {
            column: 0,
            line: 2,
        },
        rule: 'typo (typos)',
    }]);
});

