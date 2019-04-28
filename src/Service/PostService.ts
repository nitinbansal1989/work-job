import * as cache from 'es-cache';
import DbContext, { context } from "../Model/DbContext";
import Post from '../Model/Post';

let postCache: cache.Cache<number, Post> = new cache.Cache({
	valueFunction: async (id: number) => {
		return await context.posts.where((a) => {
			return a.id.eq(id).and(a.state.eq(true));
		}).unique();
	}
});

export default class PostService {
	ctx: DbContext = null;

	constructor(ctx?: DbContext) {
		this.ctx = ctx ? ctx : context;
	}

	copyProperties(res: Post, src: any): Post {
		if (src.heading != null) res.heading.set(src.heading);
		if (src.employer != null) res.publisher.set(src.employer);
		if (src.content != null) res.content.set(src.content);
		return res;
	}

	async get(id: number): Promise<Post> {
		return await postCache.get(id);
	}

	async create(profile: any): Promise<Post> {
		let post: Post = this.ctx.posts.getEntity();
		post = this.copyProperties(post, profile);
		post = await this.ctx.posts.insert(post);
		return post;
	}

	async update(obj: any): Promise<Post> {
		let id: number = Number.parseInt(obj.id);
		let post = await this.ctx.posts.where((a) => {
			return a.id.eq(id);
		}).unique();
		post = this.copyProperties(post, obj);
		post = await this.ctx.posts.update(post);
		postCache.del(post.id.get());
		return post;
	}

	async delete(id: number) {
		let post: Post = await this.ctx.posts.where((a) => {
			return a.id.eq(id);
		}).unique();
		postCache.del(post.id.get());
		await this.ctx.posts.delete(post);
	}

	async list(params: Map<string, string>): Promise<Array<Post>> {
		let criteria = this.getExpression(params);
		let limit = params['limit'] ? Number.parseInt(params['limit']) : 100;
		let offset = params['offset'] ? Number.parseInt(params['offset']) : 0;
		return await this.ctx.posts.where(criteria).orderBy(a => {
			return a.uptdDt.desc();
		}).limit(limit, offset).list();
	}

	async single(params: Map<string, string>): Promise<Post> {
		let criteria = this.getExpression(params);
		return await this.ctx.posts.where(criteria).unique();
	}

	getExpression(params: Map<string, string>) {
		if (params) {
			let e = this.ctx.posts.getEntity();
			let c = this.ctx.getCriteria();
			if (params.get('publisher')) {
				c = c.add(e.publisher.eq(params.get('publisher')));
			}
			c = c.add(e.state.eq(true));
			return c;
		} else {
			throw 'No Parameter Found';
		}
	}

}