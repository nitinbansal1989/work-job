"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
var config = JSON.parse(fs.readFileSync(process.cwd() + '/../config/work-job.json', 'utf8'));
var instanceId = Number.parseInt(process.env.NODE_APP_INSTANCE) || 0;
config.port = config.port + instanceId;
exports.default = config;
