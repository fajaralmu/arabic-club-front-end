
export default class Filter{
	limit? :number = 5; 
	page? :number = 0;
	orderType?:string;
	orderBy?:string;
	contains?:boolean; 
	exacts?:boolean;
	day?:number;
	year?:number;
	month?:number;
	module?:string;
	fieldsFilter?:{};
	monthTo?:number;
	yearTo?:number;
	maxValue?:number;
	availabilityCheck?:boolean;
	
	//
	useExistingFilterPage?:boolean = false; 
	public static validateFieldsFilter = (filter:Filter):void => {
        const fieldsFilter = filter.fieldsFilter;
        for (const key in fieldsFilter) {
            const element = fieldsFilter[key];
            if (element == undefined || element == null || new String(element).length == 0) {
                if (filter.fieldsFilter != undefined) {
                    delete filter.fieldsFilter[key];
                }
            }
        } 
    }
	public static setOrderPropertyFromDataSet = (f:Filter, dataset: DOMStringMap) =>{
		if (dataset['orderby']) {
			f.orderBy = dataset['orderby'];
		}
		if (dataset['ordertype']) {
			f.orderType = dataset['ordertype'];
		}
	}
	public static setFieldsFilterValue = (f:Filter, name: string, value: any) => {
        if (f.fieldsFilter == undefined) {
            f.fieldsFilter = {};
        }
        f.fieldsFilter[name] = value;
    }
	public static setFieldsFilterValueFromInput = (f:Filter, input: any) => {
		const name = input.name;
		const value = input.value;
		Filter.setFieldsFilterValue(f, name, value);
    }

}
