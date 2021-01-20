import BaseEntity from './BaseEntity';
import Unit from './Unit';
import Category from './Category';
import Supplier from './Supplier';

export default class Product extends BaseEntity{
	code?:string;
	name?:string;
	description?:string;
	price?:number;
	type?:string;
	imageUrl?:string;
	unit?:Unit;
	category?:Category;
	newProduct?:boolean;
	count?:number;
	suppliers?:Supplier[];

	static getDefaultPicture(product:Product, baseImageUrl?:string) :string{

		if (product.imageUrl && product.imageUrl?.length >0) {
			return (baseImageUrl?baseImageUrl:"") + product.imageUrl.split("~")[0];
		}
		return (baseImageUrl?baseImageUrl:"") + "Default.bmp";
	}
	static getPictureNames(product:Product, baseImageUrl?:string): string[] {
		if (product.imageUrl && product.imageUrl?.length >0) {
			let names:string[] = product.imageUrl.split("~");
			if (baseImageUrl) {
				return names.map(name=>{
					return baseImageUrl+name;
				})
			}
			return names;
		}
		return [Product.getDefaultPicture(product, baseImageUrl)]
	}

	static countSummary(products:Product[]) : number
	{
		let count = 0;
		for (let i = 0; i < products.length; i++) {
			const element = products[i];
			count += element.count??0;
		}
		return count;
	}

}
