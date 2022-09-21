import {
    lint,
    reset,
} from './typos.js';
import {
    test,
    stub,
} from 'supertape';

test('putout: processor: typos: no CLI', async (t) => {
    const options = {
        fix: false,
    };
    
    await lint('hello world', {
        run: stub().rejects({
            stderr: 'errored',
        }),
    }, options);
    
    reset();
    
    const [, places] = await lint('taget', options);
    
    t.equal(places.length, 1);
    t.end();
});

test('putout: processor: typos: no CLI: no reset', async (t) => {
    const options = {
        fix: false,
    };
    
    await lint('hello world', {
        run: stub().rejects({
            stderr: 'errored',
        }),
    }, options);
    
    const [, places] = await lint('taget', options);
    
    reset();
    
    t.notOk(places.length);
    t.end();
});
