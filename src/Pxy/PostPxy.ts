import * as marked from 'marked';
import * as moment from 'moment';
import Post from '../Model/Post';

export default class PostPxy {
	id = 0;
	heading = '';
	publisher = '';
	content = '';
	type = '';
	description = '';
	imageLink = '';
	crtdDt = '';
	uptdDt = '';

	constructor(post: Post) {
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