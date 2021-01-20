import DataSet from './DataSet';
export default class Cashflow implements DataSet {

    amount: number = 0;
    count: number = 0;
    module: string = 'SELLING';
    year: number = new Date().getFullYear();
    month: number = 1;
    getAmount: () => number;
    getLabel: () => string;
    constructor() {
        this.getAmount = () => {
            return this.amount;
        }
       this.getLabel = () => {
            return this.month+"-"+this.year;
        }
    }
    
   
    static toDataSet = (cashflow:Cashflow) : DataSet => {
        return Object.assign(new Cashflow(), cashflow);
    }
    static toDataSets = (cashflows:Cashflow[]) : DataSet[] => {
        const dataSets:DataSet[]  = new Array<DataSet>();
        for (let i = 0; i < cashflows.length; i++) {
            const element = cashflows[i];
            dataSets.push(Cashflow.toDataSet(element));
        }
        return dataSets;
    }
    static maxAmount = (cashflows: Cashflow[]): number => {
        let max = 0;
        for (let i = 0; i < cashflows.length; i++) {
            const element = cashflows[i];
            if (element.amount > max) {
                max = element.amount;
            }
        }

        return max;
    }
}