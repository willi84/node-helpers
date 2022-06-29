import { LOG } from './log';
import { colors } from './../colors';
import * as readline from 'readline';
const { execSync } = require('child_process');
const clearOutput = true; // for debugging purposes

let spy, log;
describe('log library', () => {
   beforeEach(() => {
        spy = jest.spyOn(process.stdout, 'write'); //.mockImplementation(() => {});
        // spy = jest.spyOn(console, 'log').mockImplementation(() => {});
        log = new LOG();
    });
    afterEach(() => {
        jest.clearAllMocks();
        spy.mockRestore();
        // clear output if tests successful
         if (clearOutput) readline.cursorTo(process.stdout, 0, 0)
    });

    test('basic log', () => {
        log.INLINE(`somestring`, false);
        expect(spy).toHaveBeenCalledWith(`somestring`);
    });

    const CASES = [
        { test: 'log.ok has green output', fn: 'OK', fg: colors.FgWhite, bg: colors.BgGreen, status: '[OK]' },
        { test: 'log.fail has red output', fn: 'FAIL', fg: colors.FgWhite, bg: colors.BgRed, status: '[FAIL]' },
        { test: 'log.warn has yellow output', fn: 'WARN', fg: colors.FgWhite, bg: colors.BgYellow, status: '[WARN]' },
        { test: 'log.info has white output', fn: 'INFO', fg: colors.FgBlack, bg: colors.BgWhite, status: '[INFO]' },
        { test: 'log.default has green output', fn: 'DEFAULT', fg: colors.FgWhite, bg: colors.BgBlack, status: '      ' },
    ];
    const SCENARIOS = {
        'without newline': { },
        'withnewline=true': { newline: true},
        'withnewline=false': { newline: false},
    }
    const SCENARIO_KEYS = Object.keys(SCENARIOS);
    SCENARIO_KEYS.forEach(KEY => {
        const SCENARIO = SCENARIOS[KEY];
        const newline = SCENARIO['newline'] === true || SCENARIO['newline'] === undefined  ?  `\n` :  ``;
        const hasNewline = SCENARIO['newline'] === true || SCENARIO['newline'] === undefined  ?  true :  false;
        describe.each(CASES.map(CASE => [CASE]))(
            `test logs ${KEY}`,
            (CASE) => {
                it(`${CASE.test}`, async() => {
                    if(SCENARIO.hasOwnProperty('newline')){
                        log[CASE.fn]('foobar', SCENARIO['newline']);
                    } else {
                        log[CASE.fn]('foobar');
                    }
                    expect(spy).toHaveBeenCalledWith(`${newline}${CASE.fg}${CASE.bg}  ${CASE.status}  ${colors.Reset} foobar`);
                });
                afterEach(() => {
                    if (clearOutput && !hasNewline) readline.cursorTo(process.stdout, 0, 0)
                    if (clearOutput && hasNewline) execSync('clear');
                });
            }
        )
    });
});




