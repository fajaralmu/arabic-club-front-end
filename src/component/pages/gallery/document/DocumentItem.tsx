import React, { Component, Fragment } from 'react'
import { baseDocumentUrl } from '../../../../constant/Url';
import GalleryService from '../../../../services/GalleryService';
import Documents from './../../../../models/Documents';
import Card from './../../../container/Card';
import AnchorButton from './../../../navigation/AnchorButton';
import BaseComponent from './../../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import WebResponse from './../../../../models/WebResponse';
interface Props { document: Documents }
class State {
    showLink: boolean = false;
    fileName?:string
}
 class DocumentItem extends BaseComponent{

    galleryService:GalleryService;
    state: State = new State();
    constructor(props: Props) {
        super(props);
        this.galleryService = this.getServices().galleryService;
        this.state.fileName = this.props.document.fileName;
        this.state.showLink = this.props.document.accessCode == undefined || this.props.document.accessCode == "";
    }
    showAccessCodeInput = (e) => {
        const code = prompt("Enter access code for " + this.props.document.title);
        if (null == code) return;
        this.validateAccessCode(code);
    }
    validateAccessCode = (code:string) => {
        this.commonAjax(
            this.galleryService.validateDocumentAccessCode,
            this.accessCodeValidated,
            this.showCommonErrorAlert,
            code, this.props.document.id);
    }
    accessCodeValidated = (response:WebResponse) => {
        this.setState({fileName:response.message, showLink:true});
    }
    render = () => {
        const doc: Documents = Object.assign(new Documents(), this.props.document);
        doc.fileName = this.state.fileName;
        return (
            <div className="col-md-3 text-center">
                <Card>
                    <h5>{doc.title}</h5>
                    <p>{doc.description}</p>
                    <hr />
                    {this.state.showLink ?
                        <Fragment>
                            <ExtraViewer doc={doc} />
                            <a className="btn btn-outline-dark btn-sm" target="_blank" href={baseDocumentUrl() + doc.fileName} >
                                <i className="fa fa-link" />&nbsp;Link ({doc.getExtension()})
                            </a>
                        </Fragment>
                        : <AnchorButton onClick={this.showAccessCodeInput}
                            className="btn btn-dark btn-sm" children="Unlock" iconClassName="fas fa-key" />}
                </Card>
                <p />
            </div>
        )

    }
}

const ExtraViewer = (props: { doc: Documents }) => {
    const doc = props.doc;
    return (
        doc.getExtension().toLowerCase() == 'mp3' ?
            <video controls height={30} style={{width:"100%"}} src={baseDocumentUrl() + doc.fileName} />
            : null
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DocumentItem))