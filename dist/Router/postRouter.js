"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
var postRouter = new Router({ prefix: '/post' });
postRouter.get('/', function (ctx, next) {
    ctx.body = 'post';
});
postRouter.post('/', function (ctx, next) {
    ctx.body = 'post';
});
exports.default = postRouter;
