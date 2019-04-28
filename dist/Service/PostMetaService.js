"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = require("es-cache");
const DbContext_1 = require("../Model/DbContext");
let postMetaIdCache = new cache.Cache({
    valueFunction: async (id) => {
        return await DbContext_1.context.postMetas.where((a) => {
            return a.id.eq(id).and(a.state.eq(true));
        }).unique();
    }
});
class PostMetaService {
    constructor(post, ctx) {
        this.ctx = null;
        this.post = null;
        this.postMetas = null;
        this.ctx = ctx ? ctx : DbContext_1.context;
        this.post = post;
        this.postMetas = this.ctx.postMetas.where((a) => {
            return a.postId.eq(post.id.get());
        });
    }
    async list() {
        return await this.postMetas.list();
    }
    async get(id) {
        let postMeta = await postMetaIdCache.get(id);
        if (!postMeta) {
            throw 'Invalid Post';
        }
        if (postMeta.postId.get() != this.post.id.get()) {
            throw 'Unauthorized Post Access';
        }
        return postMeta;
    }
    async getByField(field) {
        let postMeta = await this.postMetas.where((a) => {
            return a.field.eq(field);
        }).unique();
        if (!postMeta) {
            throw 'Post Metadata not Found';
        }
        if (postMeta.postId.get() != this.post.id.get()) {
            throw 'Unauthorized Post Access';
        }
        return postMeta;
    }
    copyProperties(res, src) {
        if (src.field != null)
            res.field.set(src.field);
        if (src.content != null)
            res.content.set(src.content);
        if (src.state != null)
            res.state.set(src.state);
        return res;
    }
    async create(obj) {
        let postMeta = this.ctx.postMetas.getEntity();
        postMeta = this.copyProperties(postMeta, obj);
        postMeta.postId.set(this.post.id.get());
        return await this.ctx.postMetas.insert(postMeta);
    }
    async update(obj) {
        let id = Number.parseInt(obj.id);
        let postMeta = await this.get(id);
        postMeta = this.copyProperties(postMeta, obj);
        return await this.ctx.postMetas.update(postMeta);
    }
    async delete(id) {
        let postMeta = await this.ctx.postMetas.where((a) => {
            return a.postId.eq(this.post.id.get()).and(a.id.eq(id));
        }).unique();
        await this.ctx.postMetas.delete(postMeta);
    }
}
exports.default = PostMetaService;
