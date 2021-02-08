import BaseEntity from './BaseEntity';
import ImageCategory from './ImageCategory';
import { baseImageUrl } from './../constant/Url';

export default class Images extends BaseEntity {
	title?: string;
	description?: string;
	category?: ImageCategory;
	images?: string;

	imageCount() {
		return this.images ? this.images.split("~").length : 0;
	}

	getFirstImage(): string {
		try {
			return new String(this.images).split("~")[0];
		} catch (error) {
			return "default.bmp";
		}
	}

	getFullUrls(): string[] {
		const result: string[] = new Array();
		if (!this.images) {
			return ["default.bmp"];
		}
		const rawImages = this.images.split("~");
		for (let i = 0; i < rawImages.length; i++) {
			const element = rawImages[i];
			result.push(baseImageUrl() + element);
		}
		return result;
	}

}
