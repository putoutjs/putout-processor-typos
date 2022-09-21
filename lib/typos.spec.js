import {readFile} from 'fs/promises';
import {
    test,
    stub,
} from 'supertape';

import {
    lint,
    reset,
} from './typos.js';

const WORD = 'tegat'.split('').reverse()
    .join('');

test('putout: processor: typos: no CLI', async (t) => {
    const fix = false;
    
    await lint('hello world', {
        fix,
        run: stub().rejects({
            stderr: 'errored',
        }),
    });
    
    reset();
    
    const [, places] = await lint(WORD, {fix});
    
    t.equal(places.length, 1);
    t.end();
});

test('putout: processor: typos: no CLI: no reset', async (t) => {
    const fix = false;
    
    await lint('hello world', {
        fix,
        run: stub().rejects({
            stderr: 'errored',
        }),
    });
    
    const [, places] = await lint(WORD, {fix});
    
    reset();
    
    t.notOk(places.length);
    t.end();
});

test('putout: processor: typos: js', async (t) => {
    const fix = false;
    const source = await readFile(new URL('./typos.js', import.meta.url).pathname, 'utf8');
    
    const [, places] = await lint(source, {
        fix,
    });
    
    t.notOk(places.length);
    t.end();
});

