"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = require("es-cache");
const DbContext_1 = require("../Model/DbContext");
let postCache = new cache.Cache({
    valueFunction: async (id) => {
        return await DbContext_1.context.posts.where((a) => {
            return a.id.eq(id).and(a.state.eq(true));
        }).unique();
    }
});
class PostService {
    constructor(ctx) {
        this.ctx = null;
        this.ctx = ctx ? ctx : DbContext_1.context;
    }
    copyProperties(res, src) {
        if (src.heading != null)
            res.heading.set(src.heading);
        if (src.employer != null)
            res.employer.set(src.employer);
        if (src.content != null)
            res.content.set(src.content);
        return res;
    }
    async get(id) {
        return await postCache.get(id);
    }
    async create(profile) {
        let post = this.ctx.posts.getEntity();
        post = this.copyProperties(post, profile);
        post = await this.ctx.posts.insert(post);
        return post;
    }
    async update(obj) {
        let id = Number.parseInt(obj.id);
        let post = await this.ctx.posts.where((a) => {
            return a.id.eq(id);
        }).unique();
        post = this.copyProperties(post, obj);
        post = await this.ctx.posts.update(post);
        postCache.del(post.id.get());
        return post;
    }
    async delete(id) {
        let post = await this.ctx.posts.where((a) => {
            return a.id.eq(id);
        }).unique();
        postCache.del(post.id.get());
        await this.ctx.posts.delete(post);
    }
    async list(params) {
        let criteria = this.getExpression(params);
        return await this.ctx.posts.where(criteria).orderBy(a => { return a.uptdDt.desc(); }).list();
    }
    async single(params) {
        let criteria = this.getExpression(params);
        return await this.ctx.posts.where(criteria).unique();
    }
    getExpression(params) {
        if (params && params.size > 0) {
            let e = this.ctx.posts.getEntity();
            let c = this.ctx.getCriteria();
            if (params.get("employer")) {
                c = c.add(e.employer.eq(params.get("employer")));
            }
            c = c.add(e.state.eq(true));
            return c;
        }
        else {
            throw 'No Parameter Found';
        }
    }
}
exports.default = PostService;
