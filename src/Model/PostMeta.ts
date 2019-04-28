import { types } from 'es-entity';

export default class PostMeta {
	id = new types.Number();
	postId = new types.Number();
	field = new types.String();
	content = new types.String();
	state = new types.Boolean();
	crtdDt = new types.Date();
	uptdDt = new types.Date();
}