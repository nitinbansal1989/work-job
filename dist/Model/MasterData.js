"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const es_entity_1 = require("es-entity");
class MasterData {
    constructor() {
        this.id = new es_entity_1.types.Number();
        this.field = new es_entity_1.types.String();
        this.content = new es_entity_1.types.String();
        this.state = new es_entity_1.types.Boolean();
        this.crtdDt = new es_entity_1.types.Date();
        this.uptdDt = new es_entity_1.types.Date();
    }
}
exports.default = MasterData;
