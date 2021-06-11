

import React  from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../../constant/stores';
import MasterDataService from '../../../../../services/MasterDataService';
import './TextEditor.css'
import AnchorWithIcon from '../../../../navigation/AnchorWithIcon';
import BaseField from './BaseField';
import { MyFonts } from './fontList';
import { numericArray } from './../../../../../utils/StringUtil';
class IState {
    editMode: boolean = false;fieldValue: string = "";updated: boolean = false;

    //doc formats
    fontname: string = MyFonts[0]; fontsize:number = 12;
    forecolor: string = '#000000'; backcolor:string = '#ffffff';
}
const fontSizes = numericArray(6, 40);
class FormInputTextEditor extends BaseField {
    masterDataService: MasterDataService;
    state: IState = new IState();
    contentRef: React.RefObject<HTMLDivElement> = React.createRef();
    constructor(props: any) {
        super(props);
        this.masterDataService = this.getServices().masterDataService;
    } 
    formatDoc = (sCmd:string, sValue?) => {
        const oDoc = this.contentRef.current;
        if (!oDoc){
            console.debug("oDOc is missing");
            return;
        }
        console.debug("commmand: ", sCmd, "=> ", sValue);
        if (this.validateMode()) { 
            const executed =  document.execCommand(sCmd, false, sValue); 
            console.debug("EXECUTED: ", executed, " editable: ", oDoc.contentEditable);
            oDoc.focus(); 
           
        }
        this.postExecuteCommand(sCmd, sValue);
    }

    postExecuteCommand = (command:string, sValue?) => {
        if (command === 'fontname' || command === 'forecolor' || command === 'backcolor' ||command==='fontsize') {
            this.setState({[command]: sValue})
        }
    }

    validateMode = () => {
        if (!this.state.editMode) { return true; }
        alert("Uncheck \"Show HTML\".");
        if (this.contentRef.current) {
            this.contentRef.current.focus();
        }
        return false;
    }

    setValue = (e) => {
        if (this.contentRef.current) {
            this.setState({fieldValue: this.contentRef.current.innerHTML, updated: true})
        }
       
    }

    setDocMode = (bToSource) => {
        const oDoc = this.contentRef.current;
        if (!oDoc) return;
        var oContent;
        if (bToSource) {
            oContent = document.createTextNode(oDoc.innerHTML);
            oDoc.innerHTML = "";
            var oPre = document.createElement("pre");
            oDoc.contentEditable = "false";
            oPre.id = "sourceText";
            oPre.contentEditable = "true";
            oPre.appendChild(oContent);
            oDoc.appendChild(oPre);
        } else {
            if (document.all) {
                oDoc.innerHTML = oDoc.innerText;
            } else {
                oContent = document.createRange();
                oContent.selectNodeContents(oDoc.firstChild);
                oDoc.innerHTML = oContent.toString();
            }
            oDoc.contentEditable = "true";
        }
        oDoc.focus();
    }

    printDoc = () => {
        if (!this.validateMode()) { return; }
        // var oPrntWin = window.open("", "_blank", "width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
        // oPrntWin.document.open();
        // oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
        // oPrntWin.document.close();
    }

    prepopulateForm = () => {
        if (!this.props.recordToEdit || !this.contentRef.current) {
            return;

        }
        const fieldName = this.getEntityElement().id;
        let recordValue = this.props.recordToEdit[fieldName];
        if (!recordValue) return;
        this.contentRef.current.innerHTML = recordValue;
        this.setState({fieldValue: recordValue, updated: true});
    }
         
    componentDidUpdate(){
        // console.debug("component updated");
    }

    setEditMode = (mode:boolean) => {
        this.setDocMode(mode);
        this.setState({ editMode: mode});
    }
    paleteCommand = (e:any ) => {
        const anchor:HTMLAnchorElement = e.target as HTMLAnchorElement;
        const commmand:string = anchor.dataset['command']??"";
        const value = anchor.dataset['value'];
        if (commmand == 'clean'   ) { 
                this.clean(); 
        } else {
            this.formatDoc(commmand, value);
        }
    }
    clean = () => {
        const app = this;
        this.showConfirmationDanger("Clean content?")
        .then(function(ok){
            if (ok) {
                if (app.contentRef.current) {
                    app.contentRef.current.innerHTML = "<p></p>";
                }
            }
        })
    }
    contentOnChange = (e:React.ChangeEvent<HTMLDivElement>) => {
       this.setState({updated: false});
    } 
    preventDefault =(e)=>{
        try {
            e.preventDefault();
        } catch (error) {}
    }
    render() {

        const element = this.getEntityElement();
        return (
            <div>
                <input type="hidden" value={this.state.fieldValue} name={element.id} />
                <div id="toolBar1" className="input-group">
                    <FormattingList onChange={this.formatDoc} />
                    <FontList selected={this.state.fontname} onChange={this.formatDoc} />
                    <FontSizeOption selected={this.state.fontsize} onChange={this.formatDoc} />
                    <FontColorOption selected={this.state.forecolor} onChange={this.formatDoc} />
                    <BackgroundColorOption selected={this.state.backcolor} onChange={this.formatDoc} />
                </div>
                <div id="toolBar2">
                    <i  onMouseDown={this.preventDefault} onClick={this.paleteCommand} data-command="clean" className="palete fas fa-trash-alt"></i>
                    <i onMouseDown={this.preventDefault}  className="palete fas fa-print "></i>
                    <i  onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="undo" className="palete fas fa-undo"></i>
                    <i  onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="redo"  className="palete fas fa-redo"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="removeFormat" className="palete fas fa-times"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="bold" className="palete fas fa-bold"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="italic" className="palete fas fa-italic"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="underline" className="palete fas fa-underline"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="justifyleft" className="palete fas fa-align-left"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="justifycenter" className="palete fas fa-align-center"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="justifyright" className="palete fas fa-align-right"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="insertorderedlist" className="palete fas fa-list-ol"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="insertonorderedlist" className="palete fas fa-list-ul"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="formatblock" data-value="blockquote" className="palete fas fa-quote-left"></i>
                    {/* onClick="formatDoc('formatblock','blockquote');" src="data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7" /> */}
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="outdent" className="palete">+ Indentation</i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="indent" className="palete">- Indentation</i>
                    <i onMouseDown={this.preventDefault}  className="palete fas fa-link"
                    onClick={(e)=>{
                        var sLnk=prompt('Write the URL here','http:\/\/');
                        if(sLnk&&sLnk!=''&&sLnk!='http://'){
                            this.formatDoc('createlink',sLnk);
                        }
                    }}
                    ></i>
                    {/* onClick="var sLnk=prompt('Write the URL here','http:\/\/');if(sLnk&&sLnk!=''&&sLnk!='http://'){formatDoc('createlink',sLnk)}" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" /> */}
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="cut" className="palete fas fa-cut"></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="copy" className="palete fas fa-copy" ></i>
                    <i onMouseDown={this.preventDefault}  onClick={this.paleteCommand} data-command="paste" className="palete fas fa-paste"></i>
                </div>
                <div onInput={this.contentOnChange} className="container-fluid" 
                    ref={this.contentRef} id="textBox" 
                    suppressContentEditableWarning={true}
                    contentEditable="true"><p>Fill content</p></div>
                <p/>
                <AnchorWithIcon show={this.state.updated == false} style={{marginRight:'5px'}} iconClassName="fas fa-exclamation-circle" className="btn btn-warning btn-sm" onClick={this.setValue}>Update Content</AnchorWithIcon>
                <AnchorWithIcon show={this.state.updated == true}  iconClassName="fas fa-check" className="btn btn-primary btn-sm"  >Content Updated</AnchorWithIcon>

                <AnchorWithIcon className="btn btn-secondary btn-sm" attributes={{onMouseDown:this.preventDefault}} onClick={(e)=>this.setEditMode(false)} show={this.state.editMode == true} >Hide Html</AnchorWithIcon>
                <AnchorWithIcon className="btn btn-secondary btn-sm" attributes={{onMouseDown:this.preventDefault}} onClick={(e)=>this.setEditMode(true)} show={this.state.editMode == false} >Show Html</AnchorWithIcon>
            </div>
             
        )
    }
}
const FontSizeOption = (props: { selected:number, onChange: (e:string, value?:any) => any}) => {
    return (
        <select value={props.selected} className="form-control"
            onChange={(e) => props.onChange("fontsize", e.target.value)}>
            {fontSizes.map(size=> <option value={size} key={"fontSize"+size}>{size}</option>)}
        </select>
    )
}
const BackgroundColorOption = (props: {selected:string, onChange: (cmd:string, e?:any)=>any }) => {
    return (
        <>
         <span style={{paddingLeft:5, color: 'orange', paddingRight: 5}}>
            <i className="fas fa-fill-drip"/>
        </span>
        <input placeholder="Font Color" type="color" value={props.selected} className="form-control form-control-sm" onChange={
            (e:any) =>  props.onChange("backcolor",  e.target.value)  }/>
        </>
    )
} 
const FontColorOption = (props: {selected:string, onChange: (cmd:string, e?:any)=>any }) => {
    return (
        <>
        <span  style={{paddingLeft:5, color: 'red', paddingRight: 5}}>
            <i className="fas fa-font"/>
        </span>
        <input placeholder="Font Color" type="color" value={props.selected} className="form-control form-control-sm" onChange={
            (e) =>  props.onChange("forecolor", e.target.value)  }/>
        </>
    )
} 
const FormattingList = (props: { onChange: Function }) => {
    return (
        <select className="form-control" onChange={
            (e) => {
                const t = e.target;
                props.onChange("formatblock", t.value);
                t.value = "-";
            }
        }>
            {/* onChange="formatDoc('formatblock',this[this.selectedIndex].value);this.selectedIndex=0;"> */}
            <option value="-">- formatting -</option>
            <option value="h1">Title 1 &lt;h1&gt;</option>
            <option value="h2">Title 2 &lt;h2&gt;</option>
            <option value="h3">Title 3 &lt;h3&gt;</option>
            <option value="h4">Title 4 &lt;h4&gt;</option>
            <option value="h5">Title 5 &lt;h5&gt;</option>
            <option value="h6">Subtitle &lt;h6&gt;</option>
            <option value="p">Paragraph &lt;p&gt;</option>
            <option value="pre">Preformatted &lt;pre&gt;</option>
        </select>
    )
}
const FontList = (props: { onChange: Function, selected:string }) => {
    return (<select value={props.selected} className="form-control" onChange={
        (e) => props.onChange("fontname", e.target.value)}>
        {MyFonts.map((fontName, i)=>
         <option style={{fontFamily:fontName}} value={fontName} key={fontName}>{fontName}</option>   
        )}
    </select>)
}

export default withRouter(connect(
    mapCommonUserStateToProps,
)(FormInputTextEditor))