
import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import QuizService from './../../../services/QuizService';
import WebResponse from '../../../models/commons/WebResponse';
import Quiz from './../../../models/Quiz';
import SimpleError from '../../alert/SimpleError';
import Modal from '../../container/Modal';
import QuizQuestion from './../../../models/QuizQuestion';
import QuizHistoryModel from './../../../models/QuizHistory';
import User from './../../../models/User';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import BasePage from './../../BasePage';
class State {
    error:boolean  = false;
    quizHistory?:QuizHistoryModel;
}
class QuizHistoryDetail extends BasePage {
    state:State = new State();
    quizService:QuizService;
    constructor(props) {
        super(props, "Quiz History Detail", true);
        this.quizService = this.getServices().quizService;
    }
    recordLoaded = (response:WebResponse) => {
        if (response.quizHistory && response.quizHistory.quiz) {
            response.quizHistory.quiz = Quiz.clone(response.quizHistory.quiz);
            this.setState({
                error:false, quizHistory: (response.quizHistory)
            });
        }
    }
    recordNotLoaded = (error) => {
        this.setState({error:true})
    }
    loadHistoryDetail = () => {
        this.commonAjax(
        this.quizService.getHistoryDetail,
        this.recordLoaded,
        this.recordNotLoaded,
        this.getHistoryId());
    }
    getHistoryId = () => {
        return this.props.match.params.id;
    }
    componentDidMount() {
        this.validateLoginStatus(()=>{
            this.loadHistoryDetail();
            this.scrollTop();
        });
    }
    render() {
        if (this.state.error) {
            return <SimpleError><p/>Error Loading Record<p/><a onClick={this.loadHistoryDetail}>Retry</a></SimpleError>
        }
        if (!this.state.quizHistory?.quiz) {
            return <SimpleError><p/>Loading Quiz</SimpleError>
        }
        const quiz = this.state.quizHistory.quiz;
        return <div className="container-fluid section-body">
            <h2>{this.titleTag(quiz.title)}</h2>
            <AnchorWithIcon iconClassName="fas fa-arrow-left" to="/dashboard/quizhistory">Back</AnchorWithIcon>
            <p/>
            <QuizDetail user={this.state.quizHistory.user} quiz={quiz} />
        </div>
    }

}

const QuizDetail = (props:{user:undefined|User, quiz:Quiz}) => {
    const questions:QuizQuestion[] = props.quiz.questions;
    return (
        <Modal title={"Quiz By "+props.user?.displayName}>
            {questions.map((question,i)=>{
                
                return <QuestionDetail question={question} key={"qst-"+i} />
            })}
        </Modal>
    )
}
const QuestionDetail = (props:{question:QuizQuestion}) => {
    const q = props.question;
    return (
        <div>
            <p><strong>{q.number}</strong> {q.statement}</p>
            {q.essay?
                <textarea className="form-control" disabled value={q.answerEssay??""} />
                :
                <Choices question={q} />
            }
        </div>
    )
}

const Choices = (props:{question:QuizQuestion}) => {
    const q = props.question;
    return (
        <ul>{q.choices?.map((c,i)=>{
            const selected = q.answerCode == c.answerCode;
            return (
                <li style={{listStyle:'none'}} key={q.number+"-"+i}><span className={selected?"border rounded border-dark font-weight-bold":""} > {c.answerCode} </span> {c.statement}</li>
            )
        })}
        </ul>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizHistoryDetail))