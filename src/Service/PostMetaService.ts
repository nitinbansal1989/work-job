import * as es from "es-entity";
import * as cache from 'es-cache';

import DbContext, { context } from "../Model/DbContext";
import Post from '../Model/Post';
import PostMeta from "../Model/PostMeta";

let postMetaIdCache: cache.Cache<number, PostMeta> = new cache.Cache({
	valueFunction: async (id: number) => {
		return await context.postMetas.where((a) => {
			return a.id.eq(id).and(a.state.eq(true));
		}).unique();
	}
});

export default class PostMetaService {
	ctx: DbContext = null;
	post: Post = null;
	postMetas: es.collection.IQuerySet<PostMeta> = null;

	constructor(post: Post, ctx?: DbContext) {
		this.ctx = ctx ? ctx : context;
		this.post = post;
		this.postMetas = this.ctx.postMetas.where((a) => {
			return a.postId.eq(post.id.get());
		});
	}

	async list(): Promise<Array<PostMeta>> {
		return await this.postMetas.list();
	}

	async get(id: number): Promise<PostMeta> {
		let postMeta: PostMeta = await postMetaIdCache.get(id);
		if (!postMeta) {
			throw 'Invalid Post';
		}
		if (postMeta.postId.get() != this.post.id.get()) {
			throw 'Unauthorized Post Access';
		}
		return postMeta;
	}

	async getByField(field: string): Promise<PostMeta> {
		let postMeta: PostMeta = await this.postMetas.where((a) => {
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

	copyProperties(res: PostMeta, src: any): PostMeta {
		if (src.field != null) res.field.set(src.field);
		if (src.content != null) res.content.set(src.content);
		if (src.state != null) res.state.set(src.state);
		return res;
	}

	async create(obj: any): Promise<PostMeta> {
		let postMeta: PostMeta = this.ctx.postMetas.getEntity();
		postMeta = this.copyProperties(postMeta, obj);
		postMeta.postId.set(this.post.id.get());
		return await this.ctx.postMetas.insert(postMeta);
	}

	async update(obj: any): Promise<PostMeta> {
		let id: number = Number.parseInt(obj.id);
		let postMeta = await this.get(id);
		postMeta = this.copyProperties(postMeta, obj);
		return await this.ctx.postMetas.update(postMeta);
	}

	async delete(id: number) {
		let postMeta: PostMeta = await this.ctx.postMetas.where((a) => {
			return a.postId.eq(this.post.id.get()).and(a.id.eq(id));
		}).unique();
		await this.ctx.postMetas.delete(postMeta);
	}

}
