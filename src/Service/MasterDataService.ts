import * as cache from 'es-cache';
import DbContext, { context } from "../Model/DbContext";
import MasterData from '../Model/MasterData';

let masterDataCache: cache.Cache<number, MasterData> = new cache.Cache({
	valueFunction: async (id: number) => {
		return await context.masterDatas.where((a) => {
			return a.id.eq(id).and(a.state.eq(true));
		}).unique();
	}
});

export default class MasterDataService {
	ctx: DbContext = null;

	constructor(ctx?: DbContext) {
		this.ctx = ctx ? ctx : context;
	}

	copyProperties(res: MasterData, src: any): MasterData {
		if (src.heading != null) res.field.set(src.heading);
		if (src.content != null) res.content.set(src.content);
		return res;
	}

	async get(id: number): Promise<MasterData> {
		return await masterDataCache.get(id);
	}

	async create(profile: any): Promise<MasterData> {
		let m: MasterData = this.ctx.masterDatas.getEntity();
		m = this.copyProperties(m, profile);
		m = await this.ctx.masterDatas.insert(m);
		return m;
	}

	async update(obj: any): Promise<MasterData> {
		let id: number = Number.parseInt(obj.id);
		let m = await this.ctx.masterDatas.where((a) => {
			return a.id.eq(id);
		}).unique();
		m = this.copyProperties(m, obj);
		m = await this.ctx.masterDatas.update(m);
		masterDataCache.del(m.id.get());
		return m;
	}

	async delete(id: number) {
		let m: MasterData = await this.ctx.masterDatas.where((a) => {
			return a.id.eq(id);
		}).unique();
		masterDataCache.del(m.id.get());
		await this.ctx.masterDatas.delete(m);
	}

	async list(params: Map<string, string>): Promise<Array<MasterData>> {
		let criteria = this.getExpression(params);
		return await this.ctx.masterDatas.where(criteria).list();
	}

	async single(params: Map<string, string>): Promise<MasterData> {
		let criteria = this.getExpression(params);
		return await this.ctx.masterDatas.where(criteria).unique();
	}

	getExpression(params: Map<string, string>) {
		if (params && params.size > 0) {
			let e = this.ctx.masterDatas.getEntity();
			let c = this.ctx.getCriteria();
			if (params.get("field")) {
				c = c.add(e.field.eq(params.get("employer")));
			}
			c = c.add(e.state.eq(true));
			return c;
		} else {
			throw 'No Parameter Found';
		}
	}

}