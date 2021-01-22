

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import Quiz from './../../../models/Quiz';
import SimpleError from '../../alert/SimpleError';
import FormGroup from '../../form/FormGroup';
import QuizQuestion from './../../../models/QuizQuestion';
import Card from '../../container/Card';
import QuizChoice from './../../../models/QuizChoice';
import QuizService from './../../../services/QuizService';
import WebResponse from './../../../models/WebResponse';

class IState {
    quiz:Quiz | undefined = undefined;
}
class QuizDetail extends BaseComponent {
    quizService:QuizService = QuizService.getInstance();
    state:IState = new IState();
    constructor(props: any) {
        super(props,   true);
    }

    componentDidMount() {
        this.validateLoginStatus();
        this.loadQuiz();
    }
    loadQuiz = () => {
        this.commonAjaxWithProgress(
            this.quizService.getQuiz,
            this.dataLoaded,
            this.showCommonErrorAlert,
            parseInt(this.getId())
        )
    }
    dataLoaded = (response:WebResponse) => {
        this.setState({quiz:response.quiz});
    }
    getId = () => {
        return this.props.match.params.id;
    }

    render() {
       
        if (!this.state.quiz) {
            return <SimpleError>No Data</SimpleError>
        }
        const quiz:Quiz  = Object.assign(new Quiz, this.state.quiz);
        const questions:QuizQuestion[] = quiz.questions??[];
        return (
            <div id="QuizDetail" className="container-fluid">
                <h2>Quiz Detail</h2>
                <div className="alert alert-info">
                    <FormGroup label="Title">{quiz.title}</FormGroup>
                    <FormGroup label="Description">{quiz.description}</FormGroup>
                    {questions.map((question,i)=>{
                        const choices:QuizChoice[] = question.choices??[];
                        return (
                            <Card key={"qdl-"+i}>
                                <h4>{i+1}. {question.statement}</h4>
                                {choices.map((choice, c) => {
                                    return (
                                        <div key={"qdc-"+i+c}>
                                            <b>{choice.answerCode}</b>
                                            <span style={{marginLeft:'5px'}}>{choice.statement}</span>
                                            {choice.answerCode == question.answerCode ?" - Answer":""}
                                        </div>
                                    )
                                })}
                            </Card>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizDetail))