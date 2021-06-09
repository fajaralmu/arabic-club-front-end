

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import Quiz from './../../../models/Quiz';
import SimpleError from '../../alert/SimpleError';
import FormGroup from '../../form/FormGroup';
import QuizQuestion from './../../../models/QuizQuestion';
import Card from '../../container/Card';
import QuizChoice from './../../../models/QuizChoice';
import QuizService from './../../../services/QuizService';
import WebResponse from '../../../models/commons/WebResponse';
import AnchorButton from './../../navigation/AnchorButton';
import { baseImageUrl } from './../../../constant/Url';
import Spinner from '../../loader/Spinner';
import { timerString } from './../../../utils/DateUtil';
import BasePage from './../../BasePage';

class IState {
    quiz: Quiz | undefined = undefined;
    loading: boolean = false;
}
class QuizDetail extends BasePage {
    quizService: QuizService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Quiz Detail", true);
        this.quizService = this.getServices().quizService;
    }
    startLoading = (withProgress: boolean) => {
        super.startLoading(withProgress);
        this.setState({ loading: true });
    }
    endLoading = () => {
        super.endLoading();
        this.setState({ loading: false });
    }
    componentDidMount() {
        this.validateLoginStatus(()=>{
            this.loadQuiz();
            this.scrollTop()
        });
        
    }
    loadQuiz = () => {
        this.commonAjaxWithProgress(
            this.quizService.getQuiz,
            this.dataLoaded,
            this.showCommonErrorAlert,
            parseInt(this.getId())
        )
    }
    dataLoaded = (response: WebResponse) => {
        this.setState({ quiz: response.quiz });
    }
    getId = () => {
        return this.props.match.params.id;
    }
    editRecord = (e) => {
        const app = this;
        this.showConfirmation("Edit Quiz?")
            .then(function (ok) {
                if (!ok) return;
                app.props.history.push({
                    pathname: "/quizmanagement/form",
                    state: { quiz: app.state.quiz }
                })
            });
    }
    deleteRecord = (e) => {
        const app = this;
        this.showConfirmationDanger("Delete Quiz?")
            .then(function (ok) {
                if (!ok) return;
                app.doDeleteQuiz();
            });
    }
    doDeleteQuiz = () => {
        if (!this.state.quiz) return;
        this.commonAjaxWithProgress(
            this.quizService.deleteQuiz,
            this.dataDeleted,
            this.showCommonErrorAlert,
            this.state.quiz.id
        )
    }
    dataDeleted = (response: WebResponse) => {
        this.showInfo("Record Deleted");
        this.setState({ quiz: undefined });
    }

    render() {

        if (!this.state.quiz) {
            return (
                <div id="QuizDetail" className="container-fluid section-body">
                    {this.titleTag()}
                    {this.state.loading ? <Spinner /> : <SimpleError children="No Data" />}
                </div>
            )
        }
        const quiz: Quiz = Object.assign(new Quiz, this.state.quiz);
        const questions: QuizQuestion[] = quiz.questions ?? new Array<QuizQuestion>();
        const questionTimered: boolean = quiz.questionsTimered;
        return (
            <div  className="section-body container-fluid">
                {this.titleTag()}
                <div >
                    <div className="alert alert-info">
                        <FormGroup label="Title">{quiz.title}</FormGroup>
                        <FormGroup label="Access Code"><i>{quiz.accessCode}</i></FormGroup>
                        <FormGroup label="Description">{quiz.description}</FormGroup>
                        <FormGroup label="On Finished Message">{quiz.afterCompletionMessage}</FormGroup>
                        <FormGroup label="Duration ">{timerString(quiz.duration)}</FormGroup>
                        <FormGroup label="Active">{quiz.active ? "YES" : "NO"}</FormGroup>
                        <FormGroup label="Repeatable">{quiz.repeatable ? "YES" : "NO"}</FormGroup>
                        <FormGroup label="Show All Question">{quiz.showAllQuestion ? "YES" : "NO"}</FormGroup>
                        <FormGroup label="Qestions Timered">{quiz.questionsTimered ? "YES" : "NO"}</FormGroup>
                        <FormGroup>

                            <AnchorButton style={{ marginRight: '5px' }} iconClassName="fas fa-edit" className="btn btn-warning" onClick={this.editRecord}>Edit</AnchorButton>
                            <AnchorButton className="btn btn-danger" iconClassName="fas fa-times" onClick={this.deleteRecord}>Delete</AnchorButton>
                        </FormGroup>
                        <FormGroup label="Image">
                            {quiz.image?
                            <img height="100" width="100" src={baseImageUrl()+quiz.image} />:"No Image"}
                        </FormGroup>
                    </div>
                    {questions.map((question, i) => {
                        return (
                            <Question questionTimered={questionTimered} number={i+1} key={"qdl-" + i} question={question} />
                        )
                    })}
                </div>
            </div>
        )
    }
}

const Question = (props: {questionTimered:boolean, number:number, question: QuizQuestion }) => {
    const question = props.question;
    const choices: QuizChoice[] = question.choices ?? [];
    return (
        <Card attributes={{ style: { marginBottom: '5px' } }}>
            <h4>{props.number}. {question.statement}</h4>
            <FormGroup show={props.questionTimered}>
                <i className="fas fa-clock"/>&nbsp;{timerString(question.duration)}
            </FormGroup>
            {question.image ? <img src={baseImageUrl() + question.image} height="100" /> : null}
            {question.essay? <p>
                <u  >Answer:</u>
                <p>{question.answerEssay}</p>
            </p>:null}
            {choices.map((choice, c) => {
                const rightAnswer = choice.answerCode == question.answerCode;
                return (
                    <div key={"qdc-" + question.id + c}>
                        <b className={rightAnswer ? "border rounded border-success text-success" : "text-dark"}>{choice.answerCode}</b>
                        <span style={{ marginLeft: '5px' }}>{choice.statement}</span>
                        <p />
                        {choice.image ? <img src={baseImageUrl() + choice.image} height="100" /> : null}
                    </div>
                )
            })}
        </Card>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizDetail))