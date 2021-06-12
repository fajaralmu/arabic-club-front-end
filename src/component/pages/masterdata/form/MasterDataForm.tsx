

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import Modal from '../../../container/Modal';
import EntityProperty from '../../../../models/settings/EntityProperty';
import EntityElement from '../../../../models/settings/EntityElement';
import MasterDataService from '../../../../services/MasterDataService';
import AnchorButton from '../../../navigation/AnchorButton';
import WebResponse from '../../../../models/commons/WebResponse'; 
import { FieldType } from '../../../../models/FieldType';
import FormInputField from './FormInputField';
import AttachmentInfo from './../../../../models/AttachmentInfo';

class MasterDataForm extends BaseComponent {
    masterDataService: MasterDataService;
    editRecordMode:boolean = false;
    recordToEdit?:{} = undefined;
    constructor(props: any) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
        if (props.recordToEdit) {
            this.editRecordMode = true;
            this.recordToEdit = props.recordToEdit;
        }
    }
    
    getEntityProperty(): EntityProperty {
        return this.props.entityProperty;
    }
    componentDidUpdate() {
        if (this.getEntityProperty().editable == false || this.getEntityProperty().creatable == false) {
            this.props.onClose();
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        this.showConfirmation("Save data?")
            .then((ok)=> {
                if (ok) { this.submit(form) }
            });
    }
    getEntityElement(key:string) :EntityElement |undefined {
        return EntityProperty.getEntityElement(this.getEntityProperty(), key);
    }
    submit = (form: HTMLFormElement) => {
        const formData: FormData = new FormData(form);
        const object: {} = {};
        const promises: Promise<any>[] = new Array();
        const nulledFields:any[] = [];
        let withRealtimeProgress:boolean = false;

        formData.forEach((value, key) => {
            console.debug("Form data ", key);
            if (!object[key]) {
                object[key] = new Array();
            }
            const element:EntityElement|undefined = this.getEntityElement(key);
            if (!element) return false;
            switch (element.fieldType) {
                case FieldType.FIELD_TYPE_CHECKBOX:
                    object[key].push(value == "true");
                    break;
                case FieldType.FIELD_TYPE_DYNAMIC_LIST:
                case FieldType.FIELD_TYPE_FIXED_LIST:
                    const valueAttr = element.optionValueName;
                    if (valueAttr) {
                        object[key].push({ [valueAttr]: value })
                    }
                    break;
                case FieldType.FIELD_TYPE_DOCUMENT:
                    console.debug(key, " is DOCUMENT");
                    if (value == "NULLED") {
                        console.debug("NULLED VALUE ADDED: ", key);
                        nulledFields.push(key);
                    } else {
                        const fileName = formData.get(key+'-attachment-info');
                        if (fileName && new String(value).startsWith("data:")) {
                            withRealtimeProgress = true;
                            const attachmentInfo:AttachmentInfo =   AttachmentInfo.instance(fileName, new String(value).toString());
                            object["attachmentInfo"] = [(attachmentInfo)];
                            object[key].push(fileName);
                        }else {
                            object[key].push(value);
                        }
                    }
                    break;
                case FieldType.FIELD_TYPE_IMAGE:
                    console.debug(key, " is image");
                    if (value == "NULLED") {
                        console.debug("NULLED VALUE ADDED: ", key);
                        nulledFields.push(key);
                    } else {
                        if (new String(value).startsWith("data:image")) {
                            withRealtimeProgress = true;
                        }
                        object[key].push(value);
                    }
                    break;
                default:
                    object[key].push(value);
                    break;
            }
            return true;
            
        });  
        Promise.all(promises).then( (val) => {
            const objectPayload = this.generateRequestPayload(object, nulledFields);
            console.debug("Record object to save: ", objectPayload, "realtimeProgress: ", withRealtimeProgress);
            this.ajaxSubmit(objectPayload, withRealtimeProgress);
        });
        
    }

    generateRequestPayload = (rawObject: {}, nulledFields:any[]): {} => { 
        const result:{nulledFields:Array<any>} = this.editRecordMode && this.recordToEdit? 
        {...this.recordToEdit, nulledFields:nulledFields} : 
        {nulledFields:new Array() };
        for (const key in rawObject) {
            const element: any[] = rawObject[key];
            // console.debug(key, " length: ", element.length);
            if (element.length == 1) {
                result[key] = element[0];
            } else if (element.length > 1) {
                result[key] = element.join("~");
            }
        }
        result.nulledFields = nulledFields;
        return result;
    }

    ajaxSubmit = (object: any, realtimeProgress: boolean) => {
        const property = this.getEntityProperty();
        if (property.withProgressWhenUpdated == true || realtimeProgress){
            this.commonAjaxWithProgress(
                this.masterDataService.save, this.recordSaved, this.showCommonErrorAlert,
                property.entityName, object, this.editRecordMode
            )
        } else{
            this.commonAjax(
                this.masterDataService.save, this.recordSaved, this.showCommonErrorAlert,
                property.entityName, object, this.editRecordMode
            )
        }
    }
    recordSaved = (response: WebResponse) => {
        const property = this.getEntityProperty();
        this.showInfo(property.alias+ " has been "+(this.editRecordMode?"updated":"added"));
        if (this.props.recordSavedCallback) {
            this.props.recordSavedCallback(this.editRecordMode);
        }
    }
    render() {
        const entityProperty: EntityProperty = this.getEntityProperty();

        const editModeStr = this.editRecordMode ?  <span className="badge badge-warning">Edit Mode</span>:""
        return ( 
            <div id="MasterDataForm" >
                <AnchorButton style={{ marginBottom: '5px' }} onClick={this.props.onClose} iconClassName="fas fa-angle-left">Back</AnchorButton>
                <form onSubmit={this.onSubmit} id="record-form">
                <Modal title={<span>{entityProperty.alias} Record Form {editModeStr}</span>} footerContent={<SubmitReset />}>
                        <InputFields app={this.parentApp} recordToEdit={this.recordToEdit}  entityProperty={entityProperty} />
                    </Modal>
                </form>
            </div>
        )
    }
}

const SubmitReset = (props) => {
    return (
        <div className="btn-group">
            <button type="submit" className="btn btn-primary">Submit</button>
            <input type="reset" className="btn btn-warning" />
        </div>
    )
}


const InputFields = (props: { app: any, entityProperty: EntityProperty, recordToEdit:{}|undefined }) => {
    const elements: EntityElement[] = props.entityProperty.elements;
    const groupedElements: Array<Array<EntityElement>> = new Array();
    let counter: number = 0;
    const hasTextEditor = EntityProperty.hasTextEditorField(elements);
    groupedElements.push(new Array());
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (!hasTextEditor && i > 0 && i % 5 == 0) {
            counter++;
            groupedElements.push(new Array());
        }
        groupedElements[counter].push(element);
    }
    return (
        <div className="row">
            {groupedElements.map((elements, ei) => {
                return (
                    <div key={"GROUPED_ELEMENT_"+ei} className={hasTextEditor?"col-lg-12":"col-lg-6"}>
                        {elements.map(element => {
                            const key = "form-input-for-"+props.entityProperty.entityName+element.id;
                            return <FormInputField key={key} recordToEdit={props.recordToEdit} entityElement={element} />
                        })}
                    </div>
                )
            })}
        </div>
    )
}
export default withRouter(connect(mapCommonUserStateToProps)(MasterDataForm))