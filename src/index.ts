#! /usr/bin/env node

import * as path from 'path';
import * as koa from 'koa';
import * as koaStatic from 'koa-static';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
// import * as session from 'koa-session';
// import * as redisStore from 'koa-redis';
import * as helmet from 'koa-helmet';
import * as morgan from 'koa-morgan';
import * as router from 'koa-router';
import * as koaHandlebars from 'koa-handlebars';
import * as handlebars from 'handlebars';
import * as cache from 'es-cache';

import config from './config';
import PostService from './Service/PostService';
import PostPxy from './Pxy/PostPxy';

var postService = new PostService();

var app = new koa();
app.use(compress());
app.use(bodyParser());
// if (config.redis) {
//   app.use(session({
//     secret: 'work-job',
//     resave: false,
//     saveUninitialized: false,
//     store: redisStore(config.redis)
//   }, app));
// } else {
//   app.use(session({
//     secret: 'work-job',
//     resave: false,
//     saveUninitialized: false
//   }));
// }
app.use(helmet());
app.use(koaHandlebars({
  defaultLayout: "main"
}));

// Static files
app.use(koaStatic(process.cwd() + '/public', {
  maxAge: '1d',
  extensions: ['html'],
  dotfiles: 'ignore'
}));

// app.use(koaStatic(process.cwd() + '/public/view', {
//   maxAge: '1d',
//   extensions: ['html'],
//   dotfiles: 'ignore'
// }));

// app.use(koaStatic(process.cwd() + '/public/view/home', {
//   maxAge: '1d',
//   extensions: ['html'],
//   dotfiles: 'ignore'
// }));

// app.use(koaStatic(process.cwd() + '/public/html', {
//   maxAge: '1d',
//   extensions: ['html'],
//   dotfiles: 'ignore'
// }));

app.use(morgan(':date[iso] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));

var homeRouter = new router();

homeRouter.get('/', async (ctx: router.IRouterContext & { render: Function }, next) => {
  let params = new Map<string, any>();
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
    posts.push(new PostPxy(t));
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

homeRouter.get('/post/:postLink', async (ctx: router.IRouterContext & { render: Function }, next) => {
  let postId = Number.parseInt((<string>ctx.params.postLink).split('-')[0]);
  let post = new PostPxy(await postService.get(postId));
  await ctx.render('post', {
    heading: post.heading,
    description: post.description,
    post: post
  });
});

app.use(homeRouter.routes()).use(homeRouter.allowedMethods());

// Error Handler
app.on('error', (err, ctx: koa.Context) => {
  console.error(err);
  ctx.status = err.status ? err.status : 400;
  let msg = '';
  if (err.message) msg = err.message;
  else if (err) msg = err;
  else msg = "Something Broke!";
  ctx.body = msg;
});

// Start Server
var server = app.listen((<number>config.port), function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port);
});
