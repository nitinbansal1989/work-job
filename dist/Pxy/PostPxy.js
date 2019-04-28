"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const marked = require("marked");
const moment = require("moment");
class PostPxy {
    constructor(post) {
        this.id = 0;
        this.heading = '';
        this.publisher = '';
        this.content = '';
        this.type = '';
        this.description = '';
        this.imageLink = '';
        this.crtdDt = '';
        this.uptdDt = '';
        this.id = post.id.get();
        this.heading = post.heading.get();
        this.publisher = post.publisher.get();
        this.description = post.description.get();
        this.imageLink = post.imageLink.get();
        switch (post.type.get()) {
            case 'md':
                this.content = marked(post.content.get());
                break;
            case 'html':
                this.content = post.content.get();
                break;
            default:
                this.content = post.content.get();
                break;
        }
        this.crtdDt = moment(post.crtdDt.get()).format('LLLL');
        this.uptdDt = moment(post.uptdDt.get()).format('LLLL');
    }
}
exports.default = PostPxy;
