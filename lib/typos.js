import {execa} from 'execa';
import tryToCatch from 'try-to-catch';
import tryCatch from 'try-catch';
import fullstore from 'fullstore';

const {parse} = JSON;

const NO_PLACES = [];

function buildCommand({fix}) {
    if (!fix)
        return 'typos - --format json';
    
    return 'typos - --write-changes --format json';
}

export const files = [
    '*.*',
];

const TyposInPath = fullstore(true);

export const reset = () => {
    TyposInPath(true);
};

export const lint = async (code, {fix, run = execa}) => {
    if (!TyposInPath())
        return [code, NO_PLACES];
    
    const [error, result] = await tryToCatch(run, buildCommand({fix}), {
        shell: true,
        input: code,
    });
    
    const last = code.at(-1) || '';
    
    if (error?.stderr) {
        TyposInPath(false);
        return [code, NO_PLACES];
    }
    
    if (fix && result)
        return [result.stdout + last, NO_PLACES];
    
    const places = parsePlaces(code, (error || result).stdout);
    
    return [code, places];
};

function parsePlaces(code, rawPlaces) {
    const places = [];
    const lines = rawPlaces
        .replace(code, '')
        .split('\n');
    
    for (const line of lines) {
        const [error, rawPlace] = tryCatch(parse, line);
        
        if (error)
            return places;
        
        places.push(toPlace(rawPlace));
    }
    
    return places;
}

function toPlace({line_num, byte_offset, typo, corrections}) {
    return {
        message: `Typo: ${typo} -> ${corrections.join()}`,
        rule: `typo (typos)`,
        position: {
            line: line_num,
            column: byte_offset,
        },
    };
}

