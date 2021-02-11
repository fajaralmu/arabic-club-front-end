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
import { baseImageUrl } from './../../../../constant/Url';

class IState {
    quiz: Quiz | undefined = undefined;
    loading: boolean = false;
    quizResult: QuizResult | undefined
    timeout: boolean = false;
    running: boolean = false;
    errorSubmit: boolean = false;
}

class PublicQuizChallenge extends BaseComponent {
    quizTemp?:Quiz = undefined;
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
        if (this.timerRef.current) this.timerRef.current.updateTimerLoop();
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
        this.setState({ errorSubmit:false,
            timeout: false, 
            quizResult: response.quizResult, 
            quiz: Object.assign(new Quiz(), response.quizResult?.submittedQuiz) },
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
    submitAnwser = () => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz || this.state.quizResult) return;
        if (quiz.questionsTimered) {
            this.doSubmitAnswer();
            return;
        }
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
            ()=>this.quizNotSubmitted(Object.assign(new Quiz, quiz)),
            quiz
        )
        this.setState({ quiz: undefined });
    }

    quizNotSubmitted = (quiz:Quiz) => {
        this.quizTemp = quiz;
        this.showCommonErrorAlert("Error submitting quiz");
        this.setState({errorSubmit: true});
    }
    retrySubmit = () => {
        if (this.state.errorSubmit == false) return;
        this.setState({quiz: this.quizTemp}, this.doSubmitAnswer);
        this.quizTemp = undefined;
    }
    render() {

        if (this.state.errorSubmit) {
            return <SimpleError style={{marginTop: '20px'}} >
                <h3>Error While Submitting Answer</h3>
                <AnchorWithIcon onClick={this.retrySubmit} iconClassName="fas fa-redo">Retry</AnchorWithIcon>
            </SimpleError>
        }

        const quiz = Object.assign(new Quiz, this.state.quiz);
        if (!this.state.loading && quiz.getQuestionCount() == 0) {
            return <SimpleError style={{marginTop:'20px'}}>Quiz in currently unavailable</SimpleError>
        }
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
                <img height="250" src={quiz.image?baseImageUrl()+quiz.image:"/logo192.png"} className="rounded-circle"/>
                <h3><strong>{quiz.title}</strong></h3>
                <p>Duration: {timerString(quiz.duration)}</p>
                <p>Question: {quiz.getQuestionCount()}</p>
                <p />
                <AnchorWithIcon className="btn btn-dark" onClick={this.start} iconClassName="fas fa-play">Start</AnchorWithIcon>
            </div>
        }
        if (quiz) {
           quiz.showAllQuestion = quiz.showAllQuestion || undefined != this.state.quizResult;
        }
        const questionTimered = quiz?.questionsTimered == true && this.state.quizResult == undefined;
        return (
            <div id="PublicQuizChallenge" style={{ marginTop: '20px', }} className="container-fluid">
                {quiz && quiz.questionsTimered==false ? <QuizTimer ref={this.timerRef} onTimeout={this.setFailedTimeout} duration={quiz.duration ?? 0} /> : null}
                <h2>Quiz Challenge</h2>
                <AnchorButton onClick={this.goBack} iconClassName="fas fa-angle-left">Back</AnchorButton>
                <p />
                {this.state.quizResult ?
                    <QuizResultInfo quizResult={this.state.quizResult} tryAgain={this.tryAgain} /> : null}
                {quiz ?
                    <QuizBody questionTimered={questionTimered} onTimeout={this.setFailedTimeout} submit={this.submitAnwser} setChoice={this.setChoice} quiz={quiz} /> :
                    <SimpleError>No Data</SimpleError>
                }
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(PublicQuizChallenge))