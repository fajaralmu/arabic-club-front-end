import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseComponent from '../../../BaseComponent';
import PublicQuizService from '../../../../services/PublicQuizService';
import Quiz from '../../../../models/Quiz';
import WebResponse from '../../../../models/WebResponse';
import SimpleError from '../../../alert/SimpleError';
import Spinner from '../../../loader/Spinner';
import AnchorButton from '../../../navigation/AnchorButton';
import QuizResult from '../../../../models/QuizResult';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import { QuizResultInfo } from '../quizChallengeHelper';
import QuizBody from './QuizBody';
import QuizTimer from './QuizTimer';
import { timerString } from './../../../../utils/DateUtil';

class IState {
    quiz: Quiz | undefined = undefined;
    loading: boolean = false;
    quizResult: QuizResult | undefined
    timeout: boolean = false;
    running: boolean = false;
}

class PublicQuizChallenge extends BaseComponent {
    publicQuizService: PublicQuizService;
    state: IState = new IState();
    timerRef:React.RefObject<QuizTimer> = React.createRef();
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
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz  ) return;
        quiz.startedDate = new Date();
        this.setState({quiz:quiz});
    }
    beginTimer = () => {
        if (this.timerRef.current) this.timerRef.current.beginTimer();
    }
    setFailedTimeout = () => {
        this.doSubmitAnswer();
        this.setState({ quiz: undefined, timeout: true });
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
            .then((ok) => {
                if (ok) this.props.history.push("/quiz");
            });
    }
    getId = () =>  this.props.match.params.id;
    
    setChoice = (code: string, questionIndex: number) => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz || this.state.quizResult) return;
        if (!quiz || quiz.questions.length == 0) return;
        try {
            quiz.questions[questionIndex].answerCode = code;
            this.setState({ quiz: Object.assign(new Quiz(), quiz) });
        } catch (error) { }
    }
    quizSubmitted = (response: WebResponse) => {
        this.setState({ timeout: false, quizResult: response.quizResult, quiz: Object.assign(new Quiz(), response.quizResult?.submittedQuiz) },
            );
    }
    tryAgain = () => {
        this.showConfirmation("Try quiz again?")
            .then((ok) => { if(!ok) return; 
                    this.resetQuiz();
            })
    }
    resetQuiz = () => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz) return;
        quiz.resetCorrectChoices();
        this.setState({ quizResult: undefined, tick:0, quiz: Object.assign(new Quiz(), quiz), running: false });
    }
    submitAnwser = (e) => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz || this.state.quizResult) return;
        if (!Object.assign(new Quiz(), quiz).allQuestionHasBeenAnswered()) {
            this.showConfirmationDanger("Answers are not complete. Continue to submit answers?")
            .then((ok) => { if(!ok) return;  
                this.doSubmitAnswer(); 
            })
            return;
        }
        this.showConfirmation("Submit answers?")
            .then((ok) => { if(!ok) return;  
                this.doSubmitAnswer(); 
            })
    }

    doSubmitAnswer = () => {
        const quiz = this.state.quiz;
        if (!quiz) return;
        quiz.submittedDate = new Date();
        this.commonAjaxWithProgress(
            this.publicQuizService.submitAnswers,
            this.quizSubmitted,
            this.showCommonErrorAlert,
            quiz
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
            return <div id="PublicQuizChallenge" style={{ marginTop: '20px', paddingTop:'20px' }} className="text-center container-fluid">
                <h1 className="text-primary"><i style={{ fontSize: '5em' }} className="fas fa-book-reader" /></h1>
                <h3><strong>{quiz.title}</strong></h3>
                <p>Duration: {timerString(quiz.duration)}</p>
                <p>Question: {quiz.getQuestionCount()}</p>
                <p />
                <AnchorWithIcon className="btn btn-dark" onClick={this.start} iconClassName="fas fa-play">Start</AnchorWithIcon>
            </div>
        }

        return (
            <div id="PublicQuizChallenge" style={{ marginTop: '20px', }} className="container-fluid">
                {quiz ? <QuizTimer ref={this.timerRef} onTimeout={this.setFailedTimeout} duration={quiz.duration ?? 0} /> : null}
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

export default withRouter(connect(
    mapCommonUserStateToProps
)(PublicQuizChallenge))