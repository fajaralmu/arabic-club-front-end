import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseComponent from './../../BaseComponent';
import PublicQuizService from './../../../services/PublicQuizService';
import Quiz from './../../../models/Quiz';
import WebResponse from './../../../models/WebResponse';
import SimpleError from '../../alert/SimpleError';
import Spinner from '../../loader/Spinner';
import AnchorButton from './../../navigation/AnchorButton';
import Card from './../../container/Card';
import QuizQuestion from './../../../models/QuizQuestion';
import QuizChoice from './../../../models/QuizChoice';
import { baseImageUrl } from './../../../constant/Url';
import Modal from '../../container/Modal';

class IState {
    quiz: Quiz | undefined = undefined;
    loading: boolean = false;
    quizResult: any | undefined
}

class PublicQuizChallenge extends BaseComponent {
    publicQuizService: PublicQuizService = PublicQuizService.getInstance();
    state: IState = new IState();
    
    constructor(props: any) {
        super(props, false);
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
        this.setState({ quiz: Object.assign(new Quiz(), response.quiz), quizResult:undefined });
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
        const app = this;
        this.showConfirmation("Leave Page?")
            .then(function (ok) {
                if (ok) app.props.history.push("/quiz");
            });
    }
    getId = () => {
        return this.props.match.params.id;
    }
    setChoice = (code: string, questionIndex: number) => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz || !quiz.questions || quiz.questions.length == 0) return;
        try {
            quiz.questions[questionIndex].answerCode = code;
            this.setState({ quiz: quiz });
        } catch (error) { }
    }
    quizSubmitted = (response:WebResponse) => {
        this.setState({quizResult: response.quizResult});
    }
    submitAnwser = (e) => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz) return;
        if (!quiz.allQuestionHasBeenAnswered()) {
            this.showError("Please answer all questions!");
            return;
        }
        const app = this;
        this.showConfirmation("Submit Answers?")
        .then(function(ok){
            if (ok) {
               
                app.commonAjaxWithProgress(
                    app.publicQuizService.submitAnswers,
                    app.quizSubmitted,
                    app.showCommonErrorAlert,
                    app.state.quiz
                )
                app.setState({ quiz: undefined});
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
                <div className="alert alert-primary">
                    <QuizResult quizResult={this.state.quizResult} />
                </div>
                : null}
                {this.state.loading != true && quiz == undefined ? <SimpleError>No Data</SimpleError> : null}
                {this.state.loading ? <Spinner /> : null}
                {quiz ? <QuizBody submit={this.submitAnwser} setChoice={this.setChoice} quiz={quiz} /> : null}
            </div>
        )
    }
}

const QuizResult = (props:{quizResult:any}) => {
    const quizResult = props.quizResult;
    return (
        <div>
            <h2>Result</h2>
            <div className="row">
                <h4 className="col-2">Correct Answer</h4>
                <h4 className="col-10 text-dark">{quizResult.correctAnswer}</h4>
                <h4 className="col-2">Wroing Answer</h4>
                <h4 className="col-10 text-danger">{quizResult.wrongAnswer}</h4>
                <h4 className="col-2">Score</h4>
                <h4 className="col-10 text-primary">{quizResult.score}</h4>
            </div>
        </div>
    )
}

const QuizBody = (props: { quiz: Quiz, setChoice: any, submit: any }) => {
    const quiz = props.quiz;
    const questions: QuizQuestion[] = quiz.questions ?? [];
    return (
        <div>
            <h1>{quiz.title}</h1>
            <div className='alert alert-info'>{quiz.description}</div>
            
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
                    {question.image ? <img height="150" src={baseImageUrl + question.image} /> : null}
                     <hr/>
                    {choices.map((choice, i) => {
                        return <ChoiceItem answered={choice.answerCode == question.answerCode} setChoice={(code) => props.setChoice(code, props.index)} key={"pqci-" + i + "-of-" + props.index} choice={choice} index={i} />
                    })}
                </div>
            </div>
        </Card>
    )
}
const ChoiceItem = (props: { choice: QuizChoice, index: number, setChoice: any, answered: boolean }) => {
    const choice: QuizChoice = props.choice;
    const choiceClass = props.answered ? "btn btn-secondary" : "btn btn-outline-secondary";
    return (
        <div className="row" >
            <div className="col-1 text-left">
                <a onClick={(e) => { props.setChoice(choice.answerCode) }}
                    className={choiceClass}> <strong>{choice.answerCode}</strong></a>
            </div>
            <div className="col-11 ">
                <p>{choice.statement}</p>
                {choice.image ? <img height="150" src={baseImageUrl + choice.image} /> : null}
            </div>
        </div>
    )
}

export default withRouter(PublicQuizChallenge) 