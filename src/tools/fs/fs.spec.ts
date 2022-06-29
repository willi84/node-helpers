const BASE = `/home/willi84/dev/projects/tiny-helpers`;

import {FS, Status} from './fs';
import * as fs from 'fs';
import  mock  from 'mock-fs';
import * as readline from 'readline';
const _fs = new FS();
let PATH;
beforeEach(() => {
  mock.restore();
  PATH = `foo`;
  mock({ 
    'tmp': {
      'file.txt': 'xx',
      'file.json': '{ "xxx": 2}',
      'invalidKey.json': `{ xxx: 2, "yyy": "foobar", bla: "blubber", holsten: { "bla": "kosten"}}`,
    },
    'tmpEmpty': {}
    });
});
afterEach(() => {
  mock.restore();
  jest.clearAllMocks();
  // readline.cursorTo(process.stdout, 0);
});
describe('test folder creation', () => {
  let spy;
  beforeEach(() => {
    spy = jest.spyOn(_fs, 'hasFolder').mockReturnValue(false);
  })
  afterEach(() => {
    spy.mockRestore();
  });
  test('creation of a folder', () => {
    const status = _fs.createFolder('blubberiddbug');
    expect(status).toEqual(Status.ERROR);
  });
});
describe('test folder creation', () => {
  test('creation of a folder', () => {
    const status = _fs.createFolder(PATH);
    expect(status).toEqual(Status.CREATED);
    expect(fs.existsSync(PATH)).toEqual(true);
  });
  test('creation of a folder with log', () => {
    const status = _fs.createFolder(PATH, true);
    expect(status).toEqual(Status.CREATED);
    expect(fs.existsSync(PATH)).toEqual(true);
    // TODO: check output
  });
  test('creation of an existing folder', () => {
    mock({ 'foo': {}, });
    const status = _fs.createFolder(PATH);
    expect(status).toEqual(Status.ALREADY_EXISTS);
    expect(fs.existsSync(PATH)).toEqual(true);
  });
});
describe('test folder removal', () => {
  test('removal of an empty folder', () => {
    mock({ 'foo': {}, });
    const status = _fs.removeFolder(PATH);
    expect(status).toEqual(Status.REMOVED);
    expect(fs.existsSync(PATH)).toEqual(false);
  });
  test('removal of a not empty folder without recursive', () => {
    mock({ 'foo': {
      'text.md': 'var'
    }, });
    const status = _fs.removeFolder(PATH, false);
    expect(status).toEqual(Status.NOT_EMPTY);
    expect(fs.existsSync(PATH)).toEqual(true);
  });
  test('removal of an empty folder without recursive', () => {
    mock({ 'foo': {}, });
    const status = _fs.removeFolder(PATH, false);
    expect(status).toEqual(Status.REMOVED);
    expect(fs.existsSync(PATH)).toEqual(false);
  });
  test('removal of a not empty folder with recursive', () => {
    mock({ 'foo': {
      'text.md': 'var'
    }, });
    const status = _fs.removeFolder(PATH);
    expect(status).toEqual(Status.REMOVED);
    expect(fs.existsSync(PATH)).toEqual(false);
  });
  test('removal of a non existing folder', () => {
    const status = _fs.removeFolder(PATH);
    expect(status).toEqual(Status.NOT_EXISTS);
    expect(fs.existsSync(PATH)).toEqual(false);
  });
});
describe('read files', () => {
  test('simple content', () => {

    expect(_fs.readFile(`tmp/file.txt`).data).toEqual('xx');
    expect(_fs.readFile(`tmp/file.json`).data).toEqual({ xxx: 2});
    expect(_fs.readFile(`tmp/invalidKey.json`).data).toEqual({ xxx: 2, "yyy": "foobar", bla: "blubber", holsten: { bla: "kosten"}});
    // expect(_fs.readFile(`tmp/invalidKey.json`).data).toEqual({ xxx: 3});
    // expect(_fs.readFile(`tmp/file.notextists`)).toEqual('{ xxx: 2}');
  });

});
describe('writeFile', () => {
  const FILE = `tmp/CREATE_FILE.txt`;
  test('create file', () => {
    const result = _fs.writeFile(`${FILE}`, 'xxx');
    expect(result.status).toEqual(Status.CREATED)
    expect(fs.readFileSync(`${FILE}`).toString()).toEqual('xxx');
  });
  test('create file', () => {
    const result = _fs.writeFile(`${FILE}`, { "xxx": 2});
    expect(result.status).toEqual(Status.CREATED)
    expect(fs.readFileSync(`${FILE}`).toString()).toEqual('{"xxx":2}');
  });
  test('overwrite file', () => {
    _fs.writeFile(`${FILE}`, 'xxx');
    expect(fs.readFileSync(`${FILE}`).toString()).toEqual('xxx');

    const result = _fs.writeFile(`${FILE}`, 'yyy');
    expect(result.status).toEqual(Status.OVERWRITTEN)
    expect(fs.readFileSync(`${FILE}`).toString()).toEqual('yyy');
  });
  test('extend file', () => {
    _fs.writeFile(`${FILE}`, 'xxx');
    expect(fs.readFileSync(`${FILE}`).toString()).toEqual('xxx');

    const result = _fs.writeFile(`${FILE}`, 'yyy', true);
    expect(result.status).toEqual(Status.EXTENDED)
    expect(fs.readFileSync(`${FILE}`).toString()).toEqual('xxxyyy');
  });
  test('errors', () => {
   
  });

});
describe('list', () => {
  beforeEach(() => {
    mock.restore();
    PATH = `foo`;
    mock({ 
      'tmp': {
        'file.txt': 'xx',
        'file.json': '{ "xxx": 2}',
        'invalidKey.json': `{ xxx: 2, "yyy": "foobar", bla: "blubber", holsten: { "bla": "kosten"}}`,
      },
      'foo': {
        'file.txt': 'xx',
        'bar': {
          'file.txt': 'xx',
  
        }
      },
      'tmpEmpty': {}
      });
  });
  test('should return list of files', () => {
    expect(_fs.list(`tmp`)).toEqual(['tmp/file.json', 'tmp/file.txt', 'tmp/invalidKey.json']);
    expect(_fs.list(`tmp/`)).toEqual(['tmp/file.json', 'tmp/file.txt', 'tmp/invalidKey.json']);
    expect(_fs.list(`./`)).toEqual([ 'foo/bar/file.txt', 'foo/file.txt', 'tmp/file.json', 'tmp/file.txt', 'tmp/invalidKey.json']);
    expect(_fs.list(``)).toEqual(['foo/bar/file.txt', 'foo/file.txt', 'tmp/file.json', 'tmp/file.txt', 'tmp/invalidKey.json']);
    // expect(_fs.list(``)).toEqual(['file.json', 'file.txt', 'invalidKey.json', 'tmp', 'tmpEmpty']);
  });
  test('should return empty list of files', () => {
    expect(_fs.list(`tmpEmpty`)).toEqual([])
    expect(_fs.list(`tmpEmpty/`)).toEqual([])
    expect(_fs.list(`notexitss`)).toEqual([])
    expect(_fs.list(`note   xitss`)).toEqual([])
  });
  test('should return error', () => {});

});
describe('size', () => {
  test('size of content', () => {

    expect(_fs.size(`tmp/file.txt`, 'A')).toEqual(1);
    expect(_fs.size(`tmp/file.txt`, 'Ψ')).toEqual(2);
    expect(_fs.size(`tmp/file.txt`, '💾')).toEqual(4);
    expect(_fs.size(`tmp/file.json`, { "xxx": 2})).toEqual(9);
  });

});
