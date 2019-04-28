import * as fs from 'fs';

var config = JSON.parse(fs.readFileSync(process.cwd() + '/../config/work-job.json', 'utf8'));
var instanceId = Number.parseInt(process.env.NODE_APP_INSTANCE) || 0;
config.port = config.port + instanceId;

export default config;
