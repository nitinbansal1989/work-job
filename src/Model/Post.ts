import { types } from 'es-entity';

export default class Post {
	id = new types.Number();
	heading = new types.String();
	publisher = new types.String();
	description = new types.String();
	content = new types.String();
	type = new types.String();
	imageLink = new types.String();
	state = new types.Boolean();
	crtdDt = new types.Date();
	uptdDt = new types.Date();
}
