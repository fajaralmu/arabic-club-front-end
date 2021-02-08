import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseComponent from '../../BaseComponent';
import PublicQuizService from '../../../services/PublicQuizService';
import Quiz from '../../../models/Quiz';
import WebResponse from '../../../models/WebResponse';
import SimpleError from '../../alert/SimpleError';
import Spinner from '../../loader/Spinner';
import AnchorButton from '../../navigation/AnchorButton';
import Card from '../../container/Card';
import QuizQuestion from '../../../models/QuizQuestion';
import QuizChoice from '../../../models/QuizChoice';
import { baseImageUrl  } from '../../../constant/Url';
import Modal from '../../container/Modal';
import QuizResult from '../../../models/QuizResult'; 
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';

class IState {
    quiz: Quiz | undefined = undefined;
    loading: boolean = false;
    quizResult: QuizResult | undefined
}

class PublicQuizChallenge extends BaseComponent {
    publicQuizService: PublicQuizService;
    state: IState = new IState();

    constructor(props: any) {
        super(props, false);
        this.publicQuizService = this.getServices().publicQuizService;
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
        document.title = "Quiz Challenge";
        this.loadQuiz();
    }
    dataLoaded = (response: WebResponse) => {
        this.setState({ quiz: Object.assign(new Quiz(), response.quiz), quizResult: undefined });
    }
    loadQuiz = () => {
        this.commonAjaxWithProgress(
            this.publicQuizService.getQuiz,
            this.dataLoaded,
            this.showCommonErrorAlert,
            this.getId()
        )
    }
    goBack = (e) => {
        this.showConfirmation("Leave Page?")
            .then( (ok) => {
                if (ok) this.props.history.push("/quiz");
            });
    }
    getId = () => {
        return this.props.match.params.id;
    }
    setChoice = (code: string, questionIndex: number) => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz || this.state.quizResult) return;
        if (!quiz || !quiz.questions || quiz.questions.length == 0) return;
        try {
            quiz.questions[questionIndex].answerCode = code;
            this.setState({ quiz: quiz });
        } catch (error) { }
    }
    quizSubmitted = (response: WebResponse) => {
        this.setState({ quizResult: response.quizResult, quiz: Object.assign(new Quiz(), response.quizResult?.submittedQuiz) });
    }
    tryAgain = () => {
        this.showConfirmation("Try quiz again?")
            .then((ok) => {
                if (ok) {
                    this.resetQuiz();
                }
            })
    }
    resetQuiz = () => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz) return;
        quiz.resetCorrectChoices();
        this.setState({ quizResult: undefined, quiz: quiz });
    }
    submitAnwser = (e) => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz || this.state.quizResult) return;
        if (!quiz.allQuestionHasBeenAnswered()) {
            this.showError("Please answer all questions!");
            return;
        }
        this.showConfirmation("Submit Answers?")
            .then((ok) => {
                if (ok) {
                    this.commonAjaxWithProgress(
                        this.publicQuizService.submitAnswers,
                        this.quizSubmitted,
                        this.showCommonErrorAlert,
                        this.state.quiz
                    )
                    this.setState({ quiz: undefined });
                }
            })
    }

    render() {
        const quiz = this.state.quiz;
        return (
            <div id="PublicQuizChallenge" style={{ marginTop: '20px', }} className="container-fluid">
                <h2>Quiz Challenge </h2>
                <AnchorButton onClick={this.goBack} iconClassName="fas fa-angle-left">Back</AnchorButton>
                <p />
                {this.state.quizResult ?
                    <QuizResultInfo quizResult={this.state.quizResult} tryAgain={this.tryAgain} /> : null}
                {this.state.loading != true && quiz == undefined ? <SimpleError>No Data</SimpleError> : null}
                {this.state.loading ? <Spinner /> : null}
                {quiz ? <QuizBody submit={this.submitAnwser} setChoice={this.setChoice} quiz={quiz} /> : null}
            </div>
        )
    }
}

const QuizResultInfo = (props: { quizResult: QuizResult, tryAgain: any }) => {
    const quizResult = props.quizResult;
    return (<Modal title="Result">
        <h2 className="text-center">Your Score <strong className="text-primary">{quizResult.score}</strong></h2>
        <h4 className="text-center text-success">Correct Answer {quizResult.correctAnswer}</h4>
        <h4 className="text-center text-danger">Wrong Answer {quizResult.wrongAnswer}</h4>
        <div className="text-center">
            <AnchorButton onClick={props.tryAgain} iconClassName="fas fa-sync-alt">Try Again</AnchorButton>
        </div>
    </Modal>
    )
}

const QuizBody = (props: { quiz: Quiz, setChoice: any, submit: any }) => {
    const quiz = props.quiz;
    const questions: QuizQuestion[] = quiz.questions ?? [];
    return (
        <div>
            <h1>Quiz : {quiz.title}</h1>
            <div className='alert alert-info'>
                <h4>Duration</h4>
                <p>{quiz.duration ?? "0"} Seconds</p>
                <h4>Description</h4>
                <p>{quiz.description}</p>
            </div>

            {questions.map((question, i) => {
                return (<QuestionBody setChoice={props.setChoice} index={i} question={question} key={"pqqs-" + i} />)
            })}
            <Modal title="Option">
                <AnchorButton onClick={props.submit} className="btn btn-primary" >Submit</AnchorButton>
            </Modal>
        </div>
    )
}

const QuestionBody = (props: { index: number, question: QuizQuestion, setChoice: any }) => {
    const question = props.question;
    const choices: QuizChoice[] = question.choices ?? []
    return (
        <Card className="bg-light" attributes={{ style: { marginBottom: '5px' } }} >
            <div className="row">
                <h2 className="col-1 text-dark">{props.index + 1}</h2>
                <div className="col-11"><h4 className="text-dark">{question.statement}</h4>
                    
                    {question.image ? <img height="150" src={baseImageUrl() + question.image} /> : null}
                    <hr />
                    {choices.map((choice, i) => {
                        return <ChoiceItem
                            correctChoice={question.correctChoice}
                            answered={choice.answerCode == question.answerCode} setChoice={(code) => props.setChoice(code, props.index)} key={"pqci-" + i + "-of-" + props.index} choice={choice} index={i} />
                    })}
                </div>
            </div>
        </Card>
    )
}
const ChoiceItem = (props: { choice: QuizChoice, index: number, setChoice: any, correctChoice: string | undefined, answered: boolean }) => {
    const choice: QuizChoice = props.choice;
    let choiceClass = props.answered ? "btn btn-secondary" : "btn btn-outline-secondary";
    //after submission
    if (props.correctChoice != undefined) {
        if (choice.answerCode == props.correctChoice) {
            if (props.answered) {
                choiceClass = "btn btn-primary";
            } else {
                choiceClass = "btn btn-success";
            }
        } else if (props.answered) {
            choiceClass = "btn btn-danger";
        }
    }
    return (
        <div className="row" >
            <div className="col-1 text-left">
                <a onClick={(e) => { props.setChoice(choice.answerCode) }}
                    className={choiceClass}> <strong>{choice.answerCode}</strong></a>
            </div>
            <div className="col-11 ">
                <p>{choice.statement}</p>
                {choice.image ? <img height="150" src={baseImageUrl() + choice.image} /> : null}
            </div>
        </div>
    )
}
 
export default withRouter(connect(
    mapCommonUserStateToProps
)(PublicQuizChallenge))