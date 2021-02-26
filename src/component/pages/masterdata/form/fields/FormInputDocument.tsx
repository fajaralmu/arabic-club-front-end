
import React, { Fragment, Component, ChangeEvent } from 'react';
import { getAttachmentInfo, toBase64v2 } from '../../../../../utils/ComponentUtil';
import AnchorButton from '../../../../navigation/AnchorButton';
import EntityElement from '../../../../../models/settings/EntityElement';
import { baseDocumentUrl } from '../../../../../constant/Url';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../../constant/stores';
import BaseField from './BaseField';
import AttachmentInfo from './../../../../../models/AttachmentInfo';
import AnchorWithIcon from './../../../../navigation/AnchorWithIcon';
interface IState {
    attachmentInfo?: AttachmentInfo,
    showInputFile: boolean
}
class FormInputDocument extends BaseField {
    state: IState = {
        attachmentInfo: undefined,
        showInputFile: false
    }
    ref: React.RefObject<any> = React.createRef();
    constructor(props: any) {
        super(props);
    }
    changeFile = (e: ChangeEvent) => {

        getAttachmentInfo(e.target as HTMLInputElement).then((attachment: AttachmentInfo) => {
            this.setState({ attachmentInfo: attachment });
        })
    }
    remove = (e) => {
        const app = this;
        this.showConfirmationDanger("Remove Document?")
            .then(function (ok) {
                if (ok) {
                    app.doRemove();
                }
            })
    }

    doRemove = () => {
        if (this.ref.current) {
            this.ref.current.value = null;
        }
        this.setState({ singlePreviewData: undefined, showInputFile: false });
    }
    prepopulateForm = () => {
        if (!this.props.recordToEdit) {
            return;
        }
        let defaultValue = this.props.recordToEdit[this.getEntityElement().id];
        if (!defaultValue) {
            return;
        }
        
        const attachmentInfo = AttachmentInfo.nameOnly(defaultValue);
        this.setState({ attachmentInfo: attachmentInfo, showInputFile: true });
    }
    render() {
        const element: EntityElement = this.getEntityElement();

        return (
            <React.Fragment>
                {this.state.showInputFile ?
                    <input ref={this.ref}
                        onChange={this.changeFile} type="file" className='form-control' />

                    :
                    <Fragment>
                        <p></p>
                        <AnchorButton onClick={(e) => this.setState({ showInputFile: true })} iconClassName="fas fa-plus" className="btn btn-info btn-sm">
                            Add Document
                        </AnchorButton>
                        <input type="hidden" name={element.id} value="NULLED" />
                    </Fragment>
                }
                {this.state.attachmentInfo ?
                    <Fragment>
                        <input value={this.state.attachmentInfo.url} type="hidden" name={element.id} />
                        <input value={this.state.attachmentInfo.name} type="hidden" name={element.id+"-attachment-info"} />
                    </Fragment>
                    : null}
                <FilePreview data={this.state.attachmentInfo} />
                <AnchorButton show={this.state.attachmentInfo != undefined} onClick={this.remove} iconClassName="fas fa-times" className="btn btn-danger btn-sm">remove</AnchorButton>
            </React.Fragment>
        )
    }

}
const FilePreview = (props: { data?: AttachmentInfo }) => {
    if (!props.data) return null;
    const href = props.data.url ? props.data.url : baseDocumentUrl() + props.data.name;
    return (
        <a href={href} className="btn btn-outline-dark btn-sm" target="_blank" >
            {props.data.name}
        </a>
    )
}
export default withRouter(connect(
    mapCommonUserStateToProps,
)(FormInputDocument))