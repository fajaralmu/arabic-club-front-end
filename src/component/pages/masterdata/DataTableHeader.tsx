
import React, { Component, Fragment } from 'react';
import HeaderProps from './../../../models/HeaderProps';
export default class DataTableHeader extends Component<any, any>
{
    render(){
        const props = this.props;
        const headerProps: HeaderProps[] = props.headerProps;
        return (<thead>
            <tr>
                <th>No</th>
                {headerProps.map(headerProp => {
                    const isDate = headerProp.isDate;
                    return (
                        <th >
                            <p>{headerProp.label}</p>
                            <div>
                                {isDate ?
                                    <Fragment>
                                        <input onChange={props.filterOnChange} name={headerProp.value + "-day"}
                                            className="input-filter" placeholder={"day"} />
                                        <input onChange={props.filterOnChange} name={headerProp.value + "-month"}
                                            className="input-filter" placeholder={"month"} />
                                        <input onChange={props.filterOnChange} name={headerProp.value + "-year"}
                                            className="input-filter" placeholder={"year"} />
                                    </Fragment>
                                    :
                                    <input onChange={props.filterOnChange} placeholder={headerProp.label}
                                        className="input-filter" name={headerProp.value} />
                                }</div>
                            <div className="btn-group">
                                <button data-orderType="asc" onClick={props.orderButtonOnClick} data-orderby={headerProp.value} className="btn btn-outline-secondary btn-sm">
                                    <i data-orderType="asc" onClick={props.orderButtonOnClick} data-orderby={headerProp.value} className="fas fa-angle-up" /></button>
                                <button data-orderType="desc" onClick={props.orderButtonOnClick} data-orderby={headerProp.value} className="btn btn-outline-secondary btn-sm">
                                    <i data-orderType="desc" onClick={props.orderButtonOnClick} data-orderby={headerProp.value} className="fas fa-angle-down" /></button>
                            </div>
                        </th>
                    )
                })}
                <th>Action</th>
            </tr>
        </thead>)
    }
}