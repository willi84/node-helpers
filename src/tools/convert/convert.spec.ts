import { round, roundToString, stringToJSON } from './convert';
test('round', () => {
    expect(round(2.34245245)).toBe(2);
    expect(round(2.34245245, 2)).toBe(2.34);
    expect(round('2.34245245', 2)).toBe(2.34);
    expect(round(2, 2)).toBe(2);
    expect(round(2.1, 2)).toBe(2.1);
    expect(round(2.1, 0)).toBe(2);
});
test('roundToString', () => {
    expect(roundToString(2.34245245, 2)).toBe('2.34');
    expect(roundToString('2.34245245', 2)).toBe('2.34');
    expect(roundToString(2, 2)).toBe('2.00');
    expect(roundToString(2.1, 2)).toBe('2.10');
    expect(roundToString(2.1, 0)).toBe('2');
});

// 'file.json': '{ "xxx": 2}',
//    'invalidKey.json': `{ xxx: 2, "yyy": "foobar", bla: "blubber", holsten: { "bla": "kosten"}}`,
test('stringToJSON', () => {
    expect(stringToJSON(`{ "xxx": 2}`)).toEqual({ xxx: 2}); // Standard
    expect(stringToJSON(`{ xxx: 2}`)).toEqual({ xxx: 2}); // fn converts key with missing "
    expect(stringToJSON(`{ xxx: 2, "yyy": "foobar", bla: "blubber", holsten: { "bla": "kosten"}}`)).toEqual({ xxx: 2, "yyy": "foobar", bla: "blubber", holsten: { bla: "kosten"}}); // fn converts key with missing "
});