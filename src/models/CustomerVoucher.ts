import BaseEntity from './BaseEntity';
import Voucher from './Voucher';
import Customer from './Customer';

export default class CustomerVoucher extends BaseEntity{
	voucher?:Voucher;
	usedAmount?:number;
	member?:Customer;

}
