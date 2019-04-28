"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const es = require("es-entity");
const config_1 = require("../config");
const MasterData_1 = require("./MasterData");
const Post_1 = require("./Post");
const PostMeta_1 = require("./PostMeta");
class DbContext extends es.Context {
    constructor(config, entityPath) {
        super(config, entityPath);
        this.masterDatas = new es.collection.DBSet(MasterData_1.default);
        this.posts = new es.collection.DBSet(Post_1.default);
        this.postMetas = new es.collection.DBSet(PostMeta_1.default);
        this.init();
    }
}
exports.default = DbContext;
config_1.default.dbConfig.driver = mysql;
var context = new DbContext(config_1.default.dbConfig);
exports.context = context;
