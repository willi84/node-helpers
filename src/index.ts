import {  LOG as LOGGING } from './tools/log/log';

const LOG = new LOGGING();

// LOG(Type.OK, 'its ok')
// LOG(Type.FAIL, 'its ok')
// LOG(Type.INFO, 'its ok')
// LOG(Type.NEWLINE, 'its ok')
// LOG(Type.WARN, 'its ok')
LOG.OK('foobar')


// LogType