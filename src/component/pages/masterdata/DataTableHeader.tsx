
import React, { ChangeEvent, Component, Fragment } from 'react';
import HeaderProps from '../../../models/HeaderProps';
interface IProps {
    fieldsFilter: any,
    orderButtonOnClick(e: any): void,
    filterOnChange(e: any): void,
    headerProps: HeaderProps[],
}
export default class DataTableHeader extends Component<IProps, any>
{
    constructor(props) {
        super(props);
    }
    render() {

        const props = this.props;
        const headerProps: HeaderProps[] = props.headerProps;
        const fieldsFilter = props.fieldsFilter;
        return (<thead>
            <tr>
                <th>No</th>
                {headerProps.map((headerProp, i) => {
                    const isDate = headerProp.filterable && headerProp.isDate;
                    const headerName = headerProp.value;
                    const k = "dth-" + i + "-" + headerName;
                    if (!headerProp.filterable && !headerProp.orderable) {
                        return <th key={k} ><p children={headerProp.label} /></th>
                    }
                    const className = "form-control input-filter";
                    return (
                        <th key={k} >
                            <p children={headerProp.label} />
                            <div style={{ minWidth: '200px' }} className="input-group">
                                {isDate ?
                                    <FilterDate headerName={headerName} fieldsFilter={fieldsFilter} filterClass={className} onChange={props.filterOnChange} />
                                    :
                                    headerProp.filterable ?
                                        <input key={"filter-common-" + headerName} autoComplete="off" value={fieldsFilter[headerName] ?? ""} onChange={props.filterOnChange} placeholder={headerProp.label}
                                            className={className} name={headerName} />
                                        : null
                                }
                                <SortButton show={headerProp.orderable} headerName={headerName} onClick={props.orderButtonOnClick} />

                            </div>
                        </th>
                    )
                })}
                <th>Action</th>
            </tr>
        </thead>)
    }
}

const FilterDate = (props: { headerName: string, fieldsFilter: {}, filterClass: string, onChange(e: ChangeEvent): any }) => {
    const headerName = props.headerName;
    const className = props.filterClass;
    const fieldsFilter = props.fieldsFilter;
    return (
        <Fragment>
            <input key={"filter-day-" + headerName} autoComplete="off" value={fieldsFilter[headerName + "-day"] ?? ""} onChange={props.onChange} name={headerName + "-day"}
                className={className} placeholder={"day"} />
            <input key={"filter-month-" + headerName} autoComplete="off" value={fieldsFilter[headerName + "-month"] ?? ""} onChange={props.onChange} name={headerName + "-month"}
                className={className} placeholder={"month"} />
            <input key={"filter-year-" + headerName} autoComplete="off" value={fieldsFilter[headerName + "-year"] ?? ""} onChange={props.onChange} name={headerName + "-year"}
                className={className} placeholder={"year"} />
        </Fragment>
    )
}

const SortButton = (props: { show: boolean, onClick(e: any): any, headerName: string }) => {
    if (props.show != true) return null;
    const headerName = props.headerName;
    return (
        <div className="input-group-append btn-group">
            <button data-ordertype="asc" onClick={props.onClick} data-orderby={headerName} className="btn btn-outline-secondary btn-sm">
                <i data-ordertype="asc" onClick={props.onClick} data-orderby={headerName} className="fas fa-angle-up" /></button>
            <button data-ordertype="desc" onClick={props.onClick} data-orderby={headerName} className="btn btn-outline-secondary btn-sm">
                <i data-ordertype="desc" onClick={props.onClick} data-orderby={headerName} className="fas fa-angle-down" /></button>
        </div>
    )
}