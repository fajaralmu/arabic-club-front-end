import React, { ChangeEvent, FormEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import QuizService from './../../../services/QuizService';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Card from '../../container/Card';
import FormGroup from '../../form/FormGroup';
import { getAttachmentInfo } from '../../../utils/ComponentUtil';
import AttachmentInfo from './../../../models/AttachmentInfo';
import WebResponse from './../../../models/WebResponse';
class IState {
    attachment?:AttachmentInfo;
}
class QuizUpload extends BaseComponent {
    quizService: QuizService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, true);
        this.quizService = this.getServices().quizService;
    }
    componentDidMount() {
    }
    submit = (e:FormEvent) => {
        e.preventDefault();
        this.showConfirmation("Upload?")
        .then(ok=>{
            if (ok) this.upload();
        })
    }
    uploadSuccess = (response:WebResponse) => {
        this.showInfo("Success");
        if (response.quiz) {
            this.props.history.push("/quizmanagement/detail/"+response.quiz.id);
            return;
        } 
        this.setState({attachment:null});
    }
    upload = () => {
        if (!this.state.attachment) return;
        this.commonAjaxWithProgress(
            this.quizService.uploadQuiz,
            this.uploadSuccess,
            this.showCommonErrorAlert,
            this.state.attachment
        )
    }
    setAttachmentInfo = (e:ChangeEvent) => {
        const target:HTMLInputElement = e.target as HTMLInputElement;
        getAttachmentInfo(target).then((attchment:AttachmentInfo)=>{
            // console.debug("attchment:", attchment);
            attchment.url = "";
            if (attchment.name.endsWith(".xlsx") == false) {
                this.showCommonErrorAlert("INVALID FILE: \""+attchment.name+"\"");
                target.value = "";
                return;
            }
            this.setState({attachment:attchment})
        }).catch(this.showCommonErrorAlert);
    }
    render() {
        
        return (
            <div className="section-body container-fluid">
            <h2>Quiz Upload</h2>
                <form onSubmit={this.submit}>
                    <FormGroup label="File">
                        <input type="file" className="form-control"

                        onChange={this.setAttachmentInfo} />
                    </FormGroup>
                    <FormGroup label="Download Template">
                        <a href="resources/assets/quiz_template.xlsx" className="btn btn-dark">
                            Download
                        </a>
                    </FormGroup>
                    <FormGroup>
                        {this.state.attachment?
                        <input type="submit" className="btn btn-primary" />:null}
                    </FormGroup>
                </form>
            </div>
        )
    }

}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizUpload))