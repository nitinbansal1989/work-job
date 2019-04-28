#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa = require("koa");
const koaStatic = require("koa-static");
const bodyParser = require("koa-bodyparser");
const compress = require("koa-compress");
const helmet = require("koa-helmet");
const morgan = require("koa-morgan");
const router = require("koa-router");
const koaHandlebars = require("koa-handlebars");
const config_1 = require("./config");
const PostService_1 = require("./Service/PostService");
const PostPxy_1 = require("./Pxy/PostPxy");
var postService = new PostService_1.default();
var app = new koa();
app.use(compress());
app.use(bodyParser());
app.use(helmet());
app.use(koaHandlebars({
    defaultLayout: "main"
}));
app.use(koaStatic(process.cwd() + '/public', {
    maxAge: '1d',
    extensions: ['html'],
    dotfiles: 'ignore'
}));
app.use(morgan(':date[iso] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
var homeRouter = new router();
homeRouter.get('/', async (ctx, next) => {
    let params = new Map();
    let limit = ctx.query.limit ? Number.parseInt(ctx.query.limit) : 20;
    params.set('limit', limit);
    let offset = ctx.query.offset ? Number.parseInt(ctx.query.offset) : 0;
    params.set('offset', offset);
    let publisher = ctx.query.publisher;
    params.set('publisher', publisher);
    let tag = ctx.query.tag;
    params.set('tag', tag);
    let temp = await postService.list(params);
    let posts = new Array();
    temp.forEach((t) => {
        posts.push(new PostPxy_1.default(t));
    });
    await ctx.render('home', {
        heading: 'Work Job',
        description: '',
        posts: posts,
        publisher: publisher,
        tag: tag,
        limit: limit,
        offset: offset + limit
    });
});
homeRouter.get('/post/:postLink', async (ctx, next) => {
    let postId = Number.parseInt(ctx.params.postLink.split('-')[0]);
    let post = new PostPxy_1.default(await postService.get(postId));
    await ctx.render('post', {
        heading: post.heading,
        description: post.description,
        post: post
    });
});
app.use(homeRouter.routes()).use(homeRouter.allowedMethods());
app.on('error', (err, ctx) => {
    console.error(err);
    ctx.status = err.status ? err.status : 400;
    let msg = '';
    if (err.message)
        msg = err.message;
    else if (err)
        msg = err;
    else
        msg = "Something Broke!";
    ctx.body = msg;
});
var server = app.listen(config_1.default.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
