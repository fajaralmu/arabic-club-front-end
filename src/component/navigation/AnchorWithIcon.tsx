
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
interface IProps{
    show?:boolean, attributes?:any, iconClassName?:string, to?:string, className?:string,
    style?:any, onClick?(e:any):any, children?:any
}
export default class AnchorWithIcon extends Component<IProps, any>
{
    constructor(props: any) {
        super(props);
    }
    render() {
        if (this.props.show == false) return null;
        const btnClassName = this.props.className ?? "btn btn-outline-secondary";
        if (this.props.to) {
            return <Link {...this.props.attributes} to={this.props.to} style={this.props.style} onClick={this.props.onClick} className={btnClassName} >
                {this.props.iconClassName ?
                    <span style={{ marginRight: '5px' }}><i className={this.props.iconClassName} /></span>
                    :
                    null}
                {this.props.children}
            </Link>
        }
        return (
            <a {...this.props.attributes} style={this.props.style} onClick={this.props.onClick} className={btnClassName} >
                {this.props.iconClassName ?
                    <span style={{ marginRight: '5px' }}><i className={this.props.iconClassName} /></span>
                    :
                    null}
                {this.props.children}
            </a>
        )
    }
}