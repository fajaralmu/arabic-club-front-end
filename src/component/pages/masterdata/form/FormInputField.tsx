

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import EntityElement from '../../../../models/EntityElement';
import MasterDataService from '../../../../services/MasterDataService';
import { FieldType } from '../../../../models/FieldType';
import WebResponse from '../../../../models/WebResponse';
import FormInputImage from './FormInputImage';
import FormInputImageMultiple from './FormInputImageMultiple';
import BaseComponent from './../../../BaseComponent';
import FormGroup from './../../../form/FormGroup';
interface IState {
    inputList: any[],
    singlePreviewData?: string,
    inputElements: number[]
}
class FormInputField extends BaseComponent {
    masterDataService: MasterDataService = MasterDataService.getInstance();
    state: IState = {
        inputList: [],
        singlePreviewData: undefined,
        inputElements: [1]
    }
    ref: React.RefObject<any> = React.createRef();
    constructor(props: any) {
        super(props, false);
    }
    getEntityElement = (): EntityElement => {
        return this.props.entityElement;
    }
    getRequiredAttr = () => {
        const requiredAttr = { required: this.getEntityElement().required == true }
        return (
            // null
            requiredAttr
        )
    }
    inputListLoaded = (response: WebResponse) => {
        if (!response.entities || response.entities.length == 0) {
            throw new Error("Not found");
        }
        this.setState({ inputList: response.entities });
        this.prepopulateForm();
    }
    loadInputList = () => {
        const element = this.getEntityElement();
        const code = element.entityReferenceClass;
        this.commonAjax(
            this.masterDataService.loadAllEntities,
            this.inputListLoaded,
            this.showCommonErrorAlert,
            code
        )
    }
    hasInputList = () => {
        if (this.getEntityElement().fieldType == FieldType.FIELD_TYPE_FIXED_LIST || this.getEntityElement().fieldType == FieldType.FIELD_TYPE_DYNAMIC_LIST) {
            return true;
        }
        return false;
    }
    hasInputListAndNotReady = () => {
        return this.hasInputList() && this.state.inputList.length == 0;
    }
    validateInputType = () => {
        if (this.hasInputListAndNotReady()) {
            this.loadInputList();
        }
    }
    componentDidUpdate() {
        this.validateInputType();
    }
    componentDidMount() {
        this.validateInputType();
        this.prepopulateForm();
    }

    prepopulateForm = () => {
        if (!this.props.recordToEdit || !this.ref.current) {
            return;

        }
        const fieldName = this.getEntityElement().id;
        let recordValue = this.props.recordToEdit[fieldName];
        if (!recordValue) return;

        const fieldType: FieldType = this.getEntityElement().fieldType;
        let defaultInputValue = undefined;
        switch (fieldType) {
            case FieldType.FIELD_TYPE_DYNAMIC_LIST:
            case FieldType.FIELD_TYPE_FIXED_LIST:
                if (this.state.inputList.length == 0) {
                    break;
                }
                const optionValueName = this.getEntityElement().optionValueName;
                if (!optionValueName) break;
                defaultInputValue = recordValue[optionValueName];
                break;

            default:
                defaultInputValue = recordValue;
                break;
        }
        if (defaultInputValue) {
            this.ref.current.value = defaultInputValue;
        }
    }

    render() {
        const element = this.getEntityElement();
        const requiredAttr = this.getRequiredAttr();
        if (this.hasInputListAndNotReady()) {
            return <div className="form-group">Loading...</div>
        }
        if (element.idField == true) {
            return (
                <FormGroup orientation="vertical" label={element.lableName}>
                    <input {...requiredAttr} value="Generated" ref={this.ref} className="form-control" name={element.id} disabled />
                </FormGroup>
            )
        }
        let input = <Fragment />;
        switch (element.fieldType) {
            case FieldType.FIELD_TYPE_DYNAMIC_LIST:
            case FieldType.FIELD_TYPE_FIXED_LIST:
                const options = this.state.inputList;
                input = <select ref={this.ref} className="form-control" name={element.id} >
                    {options.map(option => {
                        const optionItemValue = element.optionValueName;
                        const optionItemName = element.optionItemName;
                        if (!optionItemName || !optionItemValue) { return null; }
                        return (
                            <option value={option[optionItemValue]} >{option[optionItemName]}</option>
                        )
                    })}
                </select>
                break;
            case FieldType.FIELD_TYPE_IMAGE:
                input = element.multiple ?
                    <FormInputImageMultiple app={this.parentApp} recordToEdit={this.props.recordToEdit} element={element} />
                    :
                    <FormInputImage app={this.parentApp} recordToEdit={this.props.recordToEdit} element={element} />
                break;
            case FieldType.FIELD_TYPE_TEXTAREA:
                input = <textarea {...requiredAttr} ref={this.ref} className="form-control" name={element.id} />
                break;
            default:
                input = <input type={element.type} {...requiredAttr} ref={this.ref} className="form-control" name={element.id} />

        }
        return (
            <FormGroup orientation='vertical' label={element.lableName}>
                { input}
            </FormGroup>
        )
    }

}

const ImagePreview = (props) => {
    if (props.show == false || !props.imageData) return null;
    return <img className="image" style={{ margin: '3px' }} src={props.imageData} width="50" height="50" />
}

export default withRouter(connect(
    mapCommonUserStateToProps,
)(FormInputField))