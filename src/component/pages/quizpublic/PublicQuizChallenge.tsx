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
import { baseImageUrl } from '../../../constant/Url';
import Modal from '../../container/Modal';
import QuizResult from '../../../models/QuizResult';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import SimpleWarning from '../../alert/SimpleWarning';
import FormGroup from '../../form/FormGroup';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import { timerString } from './../../../utils/DateUtil';
import { QuizResultInfo, Timer } from './quizChallengeHelper';

class IState {
    quiz: Quiz | undefined = undefined;
    loading: boolean = false;
    quizResult: QuizResult | undefined
    tick: number = 0;
    timeout: boolean = false;
    running: boolean = false;
}

class PublicQuizChallenge extends BaseComponent {
    publicQuizService: PublicQuizService;
    state: IState = new IState();
    timeout: any = undefined;
    constructor(props: any) {
        super(props, true);
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
    start = () => {
        this.setState({
            running: true,
        }, this.beginTimer);
    }
    setFailedTimeout = () => {
        this.doSubmitAnswer();
        this.setState({ quiz: undefined, timeout: true });
    }
    dataLoaded = (response: WebResponse) => {
        this.setState({ quiz: Object.assign(new Quiz(), response.quiz), quizResult: undefined });
    }
    updateTimer = () => {
        if (!this.state.quiz) return;
        this.resetTimeout();
        const duration = this.state.quiz?.duration;
        let tick = this.state.tick;
        if (tick >= duration) {
            this.setFailedTimeout();
            return;
        };
        tick++;
        this.setState({ tick: tick });

        this.beginTimer();
    }
    resetTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
    beginTimer = () => {
        if (!this.state.quiz) return;
        const duration = this.state.quiz?.duration;
        this.timeout = setTimeout(this.updateTimer, 1000);
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
            .then((ok) => {
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
        this.setState({ timeout: false, quizResult: response.quizResult, quiz: Object.assign(new Quiz(), response.quizResult?.submittedQuiz) },
            () => this.setState({
                tick: this.state.quiz?.duration ?? 0
            }));
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
        this.setState({ quizResult: undefined, quiz: quiz, running: false });
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
                    this.doSubmitAnswer();
                }
            })
    }

    doSubmitAnswer = () => {
        this.commonAjaxWithProgress(
            this.publicQuizService.submitAnswers,
            this.quizSubmitted,
            this.showCommonErrorAlert,
            this.state.quiz
        )
        this.setState({ quiz: undefined });
    }

    render() {
        const quiz = this.state.quiz;

        if (this.state.timeout) {
            return (<div id="PublicQuizChallenge" style={{ marginTop: '20px', }} className="container-fluid">
                <SimpleError  ><i style={{ marginRight: '5px' }} className="fas fa-exclamation-circle" /> Timeout</SimpleError>
            </div>)
        }

        if (this.state.loading) {
            return (<div id="PublicQuizChallenge" style={{ marginTop: '20px', }} className="container-fluid">
                <Spinner />
            </div>)
        }

        if (quiz && !this.state.running) {
            return <div id="PublicQuizChallenge" style={{ marginTop: '20px', }} className="text-center container-fluid">
                <h1 className="text-primary"><i style={{ fontSize: '5em' }} className="fas fa-book-reader" /></h1>
                <h3><strong>{quiz.title}</strong></h3>
                <p>Duration: {quiz.duration} Seconds</p>
                <p />
                <AnchorWithIcon className="btn btn-dark" onClick={this.start} iconClassName="fas fa-play">Start</AnchorWithIcon>
            </div>
        }

        return (
            <div id="PublicQuizChallenge" style={{ marginTop: '20px', }} className="container-fluid">
                {quiz ? <Timer tick={this.state.tick} duration={quiz.duration ?? 0} /> : null}
                <h2>Quiz Challenge</h2>
                <AnchorButton onClick={this.goBack} iconClassName="fas fa-angle-left">Back</AnchorButton>
                <p />
                {this.state.quizResult ?
                    <QuizResultInfo quizResult={this.state.quizResult} tryAgain={this.tryAgain} /> : null}
                {quiz ?
                    <QuizBody submit={this.submitAnwser} setChoice={this.setChoice} quiz={quiz} /> :
                    <SimpleError>No Data</SimpleError>
                }
            </div>
        )
    }
}


const QuizBody = (props: { quiz: Quiz, setChoice: any, submit: any }) => {
    const quiz = props.quiz;
    const questions: QuizQuestion[] = quiz.questions ?? [];
    return (
        <div>
            <h1>Quiz : {quiz.title}</h1>
            <div className='alert alert-info'>
                <FormGroup label="Duration">
                    <p>{quiz.duration ?? "0"} Seconds</p>
                </FormGroup>
                <FormGroup label="Description">
                    <p>{quiz.description}</p>
                </FormGroup>
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