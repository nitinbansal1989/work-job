import * as mysql from "mysql";
import * as es from "es-entity";

import config from '../config';

import MasterData from './MasterData';

import Post from './Post'
import PostMeta from './PostMeta';

export default class DbContext extends es.Context {
	constructor(config?: es.bean.IConnectionConfig, entityPath?: string) {
		super(config, entityPath);
		this.init();
	}

	// Cdn Models
	masterDatas = new es.collection.DBSet<MasterData>(MasterData);

	posts = new es.collection.DBSet<Post>(Post);
	postMetas = new es.collection.DBSet<PostMeta>(PostMeta);
}

// Set Database Context
config.dbConfig.driver = mysql;
var context = new DbContext(config.dbConfig);
export { context };
