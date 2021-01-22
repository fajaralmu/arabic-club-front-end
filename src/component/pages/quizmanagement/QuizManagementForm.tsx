

import React, { ChangeEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import Quiz from './../../../models/Quiz';
import Card from '../../container/Card';
import FormGroup from './../../form/FormGroup';
import QuizQuestion from './../../../models/QuizQuestion';
import AnchorButton from './../../navigation/AnchorButton';
import QuizService from './../../../services/QuizService';
import WebResponse from './../../../models/WebResponse';
import { QuestionForm, QuizInformationForm } from './QuizFormCompontnes';

class IState {
    quiz: Quiz = new Quiz();
    saved: boolean = false;
}

class QuizManagementForm extends BaseComponent {
    quizService:QuizService = QuizService.getInstance();
    state: IState = new IState();
    constructor(props: any) {
        super(props, true);
    }
    componentDidMount() {
        this.validateLoginStatus();
        document.title = "Quiz Form";
    }
    updateQuizField = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const quiz: Quiz = this.state.quiz;
        quiz[name] = value;
        this.setState({ quiz: quiz });
    }
    addQuestion = (e) => {
        const quiz: Quiz = this.state.quiz;
        if (quiz.questions == undefined) {
            quiz.questions = [];
        }
        const question:QuizQuestion = QuizQuestion.publicQuizQuestion();
        question.statement = "Question "+ quiz.questions.length;
        quiz.questions.push(question);
        this.setState({ quiz: quiz });
    }
    updateQuestionField = (e: ChangeEvent) => {
        const target = e.target as any;
        if (!target) return;

        const index = parseInt(target.dataset['index'] ?? "0");
        const quiz: Quiz = this.state.quiz;
        if (quiz.questions == undefined) return;

        quiz.questions[index][target.name] = target.value;
        this.setState({ quiz: quiz });
    }
    updateChoiceField = (e: ChangeEvent) => {
        const target = e.target as any;
        if (!target) return;

        const questionIndex = parseInt(target.dataset['questionindex'] ?? "0");
        const choiceIndex = parseInt(target.dataset['index'] ?? "0");

        const quiz: Quiz = this.state.quiz;
        if (quiz.questions == undefined) return;

        //get selected question
        const questions: QuizQuestion[] = quiz.questions ?? [];
        if (0 == questions.length) return;

        const question: QuizQuestion = questions[questionIndex];
        if (question.choices == undefined) return;

        //update selected choice
        question.choices[choiceIndex][target.name] = target.value;

        quiz.questions = questions;
        this.setState({ quiz: quiz });
    }
    removeQuestion = (index: number) => {
        const quiz: Quiz = this.state.quiz;
        if (quiz.questions == undefined) return;
        quiz.questions.splice(index, 1);
        const app = this;
        this.showConfirmationDanger("Remove Question?")
            .then(function (ok) {
                if (ok) {
                    app.setState({ quiz: quiz });
                }
            })

    }
    submitQuiz = (e) => {
        e.preventDefault();
        const quiz: Quiz = this.state.quiz;
        console.debug("QUIZ: ", quiz);
        const app = this;
        this.showConfirmation("Submit quiz?").then(function (ok) {
            if (ok) {
                app.doSubmitQuiz();
            }
        })
    }
    doSubmitQuiz = () => {
        this.commonAjaxWithProgress(
            this.quizService.addQuiz,
            this.dataSaved,
            this.showCommonErrorAlert,
            this.state.quiz
        )
    }
    dataSaved = (response:WebResponse) => {
        this.showInfo("Success");
        this.setState({saved:true})
    }
    render() {
        const quiz: Quiz = this.state.quiz;
        const questions: QuizQuestion[] = quiz.questions ?? [];
        return (
            <div id="QuizManagementForm" className="container-fluid">
                <h2>Quiz Form</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
                <form onSubmit={this.submitQuiz} >
                    <Card title="Quiz Form"> <QuizInformationForm quiz={quiz} updateField={this.updateQuizField} />
                    </Card>
                    <AnchorButton style={{ marginTop: '5px', marginBottom: '5px' }} iconClassName="fas fa-plus" onClick={this.addQuestion} >Question</AnchorButton>
                    <Card title="Quiz Questions">
                        {questions.map((question, i) => {
                            return (
                                <QuestionForm key={"quest-form-" + i}
                                    updateChoiceField={this.updateChoiceField}
                                    question={question} index={i}
                                    updateField={this.updateQuestionField}
                                    remove={this.removeQuestion}
                                />
                            )
                        })}
                    </Card>
                    <p />
                    <FormGroup>
                        {quiz.questions && quiz.questions.length > 0 ? <input type="submit" className="btn btn-primary" value="Submit" /> : null}
                    </FormGroup>
                </form>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizManagementForm))