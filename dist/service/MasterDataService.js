"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = require("es-cache");
const DbContext_1 = require("../Model/DbContext");
let masterDataCache = new cache.Cache({
    valueFunction: async (id) => {
        return await DbContext_1.context.masterDatas.where((a) => {
            return a.id.eq(id).and(a.state.eq(true));
        }).unique();
    }
});
class MasterDataService {
    constructor(ctx) {
        this.ctx = null;
        this.ctx = ctx ? ctx : DbContext_1.context;
    }
    copyProperties(res, src) {
        if (src.heading != null)
            res.field.set(src.heading);
        if (src.content != null)
            res.content.set(src.content);
        return res;
    }
    async get(id) {
        return await masterDataCache.get(id);
    }
    async create(profile) {
        let m = this.ctx.masterDatas.getEntity();
        m = this.copyProperties(m, profile);
        m = await this.ctx.masterDatas.insert(m);
        return m;
    }
    async update(obj) {
        let id = Number.parseInt(obj.id);
        let m = await this.ctx.masterDatas.where((a) => {
            return a.id.eq(id);
        }).unique();
        m = this.copyProperties(m, obj);
        m = await this.ctx.masterDatas.update(m);
        masterDataCache.del(m.id.get());
        return m;
    }
    async delete(id) {
        let m = await this.ctx.masterDatas.where((a) => {
            return a.id.eq(id);
        }).unique();
        masterDataCache.del(m.id.get());
        await this.ctx.masterDatas.delete(m);
    }
    async list(params) {
        let criteria = this.getExpression(params);
        return await this.ctx.masterDatas.where(criteria).list();
    }
    async single(params) {
        let criteria = this.getExpression(params);
        return await this.ctx.masterDatas.where(criteria).unique();
    }
    getExpression(params) {
        if (params && params.size > 0) {
            let e = this.ctx.masterDatas.getEntity();
            let c = this.ctx.getCriteria();
            if (params.get("field")) {
                c = c.add(e.field.eq(params.get("employer")));
            }
            c = c.add(e.state.eq(true));
            return c;
        }
        else {
            throw 'No Parameter Found';
        }
    }
}
exports.default = MasterDataService;
