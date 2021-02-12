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
import QuizBody from './QuizBody';
import QuizTimer from './QuizTimer'; 
import { RertyPage, QuizResultInfo, StatusTImeout, QuizLanding } from './quizChallengeHalper';

class IState {
    quiz: Quiz | undefined = undefined;
    loading: boolean = false;
    quizResult: QuizResult | undefined
    timeout: boolean = false;
    running: boolean = false;
    errorSubmit: boolean = false;
    latestUpdate: Date|undefined;
}

class PublicQuizChallenge extends BaseComponent {
    quizTemp?: Quiz = undefined;
    publicQuizService: PublicQuizService;
    state: IState = new IState();
    timerRef: React.RefObject<QuizTimer> = React.createRef();
    quizBodyRef: React.RefObject<QuizBody> = React.createRef();
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
        this.initUpdateCallback();
    }
    initUpdateCallback = () => {
        this.setWsUpdateHandler((response:WebResponse) => {
            if (response.type != 'QUIZ_ANSWER_UPDATE' || !response.date) {
                return;
            }
            this.setState({latestUpdate:new Date(response.date)})
            // console.debug("QUIZ_ANSWER_UPDATE UPDATE:", new Date(response.date??0).toLocaleString());
        })
    }
    start = (updateStartedDate: boolean = true) => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz) return;
        if (updateStartedDate) {
            quiz.startedDate = new Date();
        }
        this.setState({
            running: true, quiz: quiz
        }, () => {
            this.beginTimer();
            this.sendStartUpdate();
        });
    }
    beginTimer = () => {
        const timeout = setTimeout(()=>{
            if (this.timerRef.current) {
                this.timerRef.current.updateTimerLoop();
            } else {
                console.debug("TIME NOT READY");
            }
            clearTimeout(timeout);
        }, 500);
    }
    componentWillUnmount(){
        this.setWsUpdateHandler(undefined);
    }
    setFailedTimeout = () => {
        this.doSubmitAnswer();
        this.setState({ quiz: undefined, timeout: true });
    }
    dataLoaded = (response: WebResponse) => {
       
        if (response.quizHistory && response.quiz) {
            response.quiz.duration = response.quizHistory.remainingDuration ?? response.quiz.duration;
            response.quiz.startedDate = response.quizHistory.started;
           
            this.setState({ quiz: Object.assign(new Quiz(), response.quiz), quizResult: undefined },
                () => {
                    this.start(false);
                    this.updateQuestionIndex(response.quizHistory?.maxQuestionNumber ?? 1);
                    
                });
            return;
        }
        this.setState({ quiz: Object.assign(new Quiz(), response.quiz), quizResult: undefined });
    }
    updateQuestionIndex = (questionNumber:number) => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz  ) return;
        if (quiz.questions.length < questionNumber  ) return;
        const timeout = setTimeout(()=>{
            if (this.quizBodyRef.current) {
                this.quizBodyRef.current.updateQuestionIndex(questionNumber-1);
            } else {
                console.debug("Question Index Not Updated");
            }
            clearTimeout(timeout);
        }, 500);
    }
    loadQuiz = () => {
        this.commonAjaxWithProgress(
            this.publicQuizService.getQuiz, this.dataLoaded,
            this.showCommonErrorAlert, this.props.match.params.id
        )
    }
    goBack = (e) => {
        this.showConfirmation("Leave Page?")
            .then((ok) => {
                if (ok) this.props.history.push("/quiz");
            });
    }

    setChoice = (code: string, questionIndex: number) => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz || this.state.quizResult) return;
        if (!quiz || quiz.questions.length == 0) return;
        try {
            quiz.questions[questionIndex].answerCode = code;
            this.setState({ quiz: Object.assign(new Quiz(), quiz) },
                () => this.sendUpdateQuizHistory(Object.assign(new Quiz(), quiz))
            );
        } catch (error) { }
    }
    sendUpdateQuizHistory = (quiz: Quiz ) => {
       this.publicQuizService.sendUpdateAnswer(quiz, this.props.requestId);
    }
    sendStartUpdate = () => {
        if (this.state.quiz) {
            this.publicQuizService.sendUpdateStart(this.state.quiz, this.props.requestId);
        }
    }
    quizSubmitted = (response: WebResponse) => {
        this.setState({
            errorSubmit: false, timeout: false,
            quizResult: response.quizResult,
            quiz: Object.assign(new Quiz(), response.quizResult?.submittedQuiz)
        },
        );
    }
    tryAgain = () => {
        this.showConfirmation("Try quiz again?")
            .then((ok) => { if (!ok) return;
                this.resetQuiz();
            })
    }
    resetQuiz = () => {
        const quiz: Quiz | undefined = this.state.quiz;
        if (!quiz) return;
        quiz.resetCorrectChoices();
        this.setState({ quizResult: undefined, tick: 0, quiz: Object.assign(new Quiz(), quiz), running: false });
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
                .then((ok) => { if (!ok) return;
                    this.doSubmitAnswer();
                })
            return;
        }
        this.showConfirmation("Submit answers?")
            .then((ok) => {
                if (!ok) return;
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
            () => this.quizNotSubmitted(Object.assign(new Quiz, quiz)),
            quiz
        )
        this.setState({ quiz: undefined });
    }

    quizNotSubmitted = (quiz: Quiz) => {
        this.quizTemp = quiz;
        this.showCommonErrorAlert("Error submitting quiz");
        this.setState({ errorSubmit: true });
    }
    retrySubmit = () => {
        if (this.state.errorSubmit == false) return;
        this.setState({ quiz: this.quizTemp }, this.doSubmitAnswer);
        this.quizTemp = undefined;
    }
    render() {

        if (this.state.errorSubmit)  return (<RertyPage retrySubmit={this.retrySubmit} /> )
        const style = { marginTop: '20px', }
        const quiz = Object.assign(new Quiz, this.state.quiz);

        if (!this.state.loading && quiz.getQuestionCount() == 0) return <SimpleError style={style} children="Quiz in currently unavailable"/>
        if (this.state.timeout)  return (<StatusTImeout /> )
        if (this.state.loading) return (<div style={style} className="container-fluid"><Spinner /></div>) 
        if (quiz && !this.state.running)  return (<QuizLanding quiz={quiz} start={this.start} /> )
        
        quiz.showAllQuestion = quiz.showAllQuestion || undefined != this.state.quizResult;
        
        const questionTimered = quiz?.questionsTimered == true && this.state.quizResult == undefined;
        return (
            <div style={style} className="container-fluid">
                {quiz && quiz.questionsTimered == false ? 
                <QuizTimer latestUpdate={this.state.latestUpdate} ref={this.timerRef} onTimeout={this.setFailedTimeout} duration={quiz.duration ?? 0} /> 
                : null}

                <h2>Quiz Challenge</h2>
                <AnchorButton onClick={this.goBack} iconClassName="fas fa-angle-left">Back</AnchorButton>
                <p />

                {this.state.quizResult ?
                    <QuizResultInfo quizResult={this.state.quizResult} tryAgain={this.tryAgain} /> : 
                    null}
                {quiz ?
                    <QuizBody ref={this.quizBodyRef} questionTimered={questionTimered} onTimeout={this.setFailedTimeout} submit={this.submitAnwser} setChoice={this.setChoice} quiz={quiz} /> :
                    <SimpleError>No Data</SimpleError>
                }
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(PublicQuizChallenge))