import React, { ChangeEvent, FormEvent } from 'react'
import QuizService from './../../../services/QuizService';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormGroup from '../../form/FormGroup';
import { getAttachmentInfo } from '../../../utils/ComponentUtil';
import AttachmentInfo from './../../../models/AttachmentInfo';
import WebResponse from '../../../models/commons/WebResponse';
import BasePage from './../../BasePage';
import { contextPath } from './../../../constant/Url';
class IState {
    attachment?:AttachmentInfo;
}
class QuizUpload extends BasePage {
    quizService: QuizService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Quiz Upload", true);
        this.quizService = this.getServices().quizService;
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
                {this.titleTag()}
                <form onSubmit={this.submit}>
                    <FormGroup label="File">
                        <input type="file" className="form-control"

                        onChange={this.setAttachmentInfo} />
                    </FormGroup>
                    <FormGroup label="Download Template">
                        <div className="btn-group">
                        <a href={contextPath()+'assets/quiztemplate?mode=multiple_choice'} className="btn btn-dark">
                            Multiple Choice
                        </a>
                        <a href={contextPath()+'assets/quiztemplate?mode=essay'} className="btn btn-dark">
                            Essay
                        </a>
                        </div>
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