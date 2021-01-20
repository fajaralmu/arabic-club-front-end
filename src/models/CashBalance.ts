import BaseEntity from './BaseEntity';

export default class CashBalance extends BaseEntity{
	formerBalance?:number;
	creditAmt?:number;
	debitAmt?:number;
	actualBalance?:number;
	type?:string;
	date?:Date;
	referenceId?:string;
	referenceInfo?:string;

}
