import BaseEntity from './BaseEntity';
import Cost from './Cost';

export default class CostFlow extends BaseEntity{
	date?:Date;
	description?:string;
	nominal?:number;
	costType?:Cost;

}
