"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const es_entity_1 = require("es-entity");
class Post {
    constructor() {
        this.id = new es_entity_1.types.Number();
        this.heading = new es_entity_1.types.String();
        this.publisher = new es_entity_1.types.String();
        this.description = new es_entity_1.types.String();
        this.content = new es_entity_1.types.String();
        this.type = new es_entity_1.types.String();
        this.imageLink = new es_entity_1.types.String();
        this.state = new es_entity_1.types.Boolean();
        this.crtdDt = new es_entity_1.types.Date();
        this.uptdDt = new es_entity_1.types.Date();
    }
}
exports.default = Post;
