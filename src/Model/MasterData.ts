import { types } from 'es-entity';

export default class MasterData {
	id = new types.Number();
	field = new types.String();
	content = new types.String();
	state = new types.Boolean();
	crtdDt = new types.Date();
	uptdDt = new types.Date();
}