import React, { Component, Fragment } from 'react'
import Quiz from './../../../../models/Quiz';
import FormGroup from './../../../form/FormGroup';
import QuizQuestion from './../../../../models/QuizQuestion';
import QuizChoice from './../../../../models/QuizChoice';
import Modal from './../../../container/Modal';
import AnchorButton from './../../../navigation/AnchorButton';
import Card from './../../../container/Card';
import { baseImageUrl } from './../../../../constant/Url';
import ToggleButton from '../../../navigation/ToggleButton';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import { timerString } from './../../../../utils/DateUtil';
import QuizTimerProgress from './QuizTimerProgress';
import QuizResult from './../../../../models/QuizResult';
interface Props {
    result?: QuizResult,
    questionTimered: boolean, quiz: Quiz,
    setChoice(code: string | undefined, questionIndex: number): any,
    onTimeout(): any, submit(): any
}
class State {
    questionIndex: number = 0;
    showAllQuestion: boolean = true;
}
export default class QuizBody extends Component<Props, State> {

    questionTimerRef: React.RefObject<QuizTimerProgress> = React.createRef();
    state: State = new State();
    constructor(props) {
        super(props);
    }
    updateQuestionIndex = (index: number) => {
        // if (this.props.questionTimered) return;
        console.debug("updateQuestionIndex: ", index);
        this.setQuestionIndex(index);
    }
    getCurrentQuestion = () => {
        if (this.props.quiz.questions && this.props.quiz.questions.length > this.state.questionIndex) {
            return this.props.quiz.questions[this.state.questionIndex];
        }
        this.setState({ questionIndex: 0 });
        return this.props.quiz.questions[0];
    }
    toggleQuestionView = (showAll: boolean) => {
        this.setState({ showAllQuestion: showAll, questionIndex: 0 });
    }
    nextQuestion = () => {
        if (this.props.quiz.questions.length - 1 == this.state.questionIndex) {
            this.props.onTimeout();
            return;
        }
        const nextIndex = this.state.questionIndex + 1;
        this.setQuestionIndex(nextIndex);
    }
    setQuestionIndex = (index: number) => {
        this.setState({ questionIndex: index }, () => {
            this.resetTimer();
            try {
                this.props.setChoice(this.props.quiz.questions[index].answerCode, index);
            } catch (e) { }
        });
    }
    updateTimer = () => {
        if (this.questionTimerRef.current) {
            this.questionTimerRef.current.updateTimerLoop();
        }
    }
    resetTimer = () => {
        if (this.questionTimerRef.current) {
            this.questionTimerRef.current.resetTick();
        }
    }
    setChoice = (code: string | undefined, index: number) => {
        this.props.setChoice(code, index);
        if (this.props.questionTimered) {
            if (this.props.quiz.questions.length > index + 1) {
                const nextIndex = index + 1;
                this.setQuestionIndex(nextIndex);
            } else {
                this.onSubmit();
            }
        } else if (!this.props.quiz.showAllQuestion) {
            if (this.props.quiz.questions.length > index + 1) {
                const nextIndex = index + 1;
                this.setQuestionIndex(nextIndex);
            } else {
                this.onSubmit();
            }
        }
    }
    onSubmit = () => {
        if (this.questionTimerRef.current ) {
            this.questionTimerRef.current.stopTimer();
        }
        this.props.submit();
    }
    componentDidMount() {
        this.updateTimer();
    }
    
    render() {

        const props = this.props;
        const quiz = props.quiz;
        const questions: QuizQuestion[] = quiz.questions ?? [];
        const showAllQuestion: boolean = quiz.showAllQuestion == false ? quiz.showAllQuestion : this.state.showAllQuestion;
        return (
            <div>
                <h1><i className="fas fa-feather-alt" />&nbsp;{quiz.title}</h1>
                <div className='alert alert-info'>
                    <FormGroup label="Started at">
                        {quiz.startedDate ? new Date(quiz.startedDate).toLocaleString() : "-"}
                    </FormGroup>
                    <FormGroup show={!this.props.result} label="Duration">
                        <p>{timerString(quiz.duration)}</p>
                    </FormGroup>
                    {/* <FormGroup label="Description">
                        <p>{quiz.description}</p>
                    </FormGroup> */}
                    <FormGroup label="Show All Question">
                        {/* <ToggleButton onClick={this.toggleQuestionView}
                            active={this.state.showAllQuestion}
                        /> */}
                        {!quiz.showAllQuestion ? "No" : <ToggleButton onClick={this.toggleQuestionView}
                            active={this.state.showAllQuestion}
                        />}
                    </FormGroup>
                </div>
                {showAllQuestion ? questions.map((question, i) => {
                    return (<QuestionBody setChoice={this.setChoice} index={i} question={question} key={"pqqs-" + i} />)
                }) :
                    <Fragment>
                        {props.questionTimered  ?
                            <QuizTimerProgress display="progress" onTimeout={this.nextQuestion} ref={this.questionTimerRef} duration={this.getCurrentQuestion().duration} />
                            : null
                        }
                        <QuestionNavigation enabled={quiz.questionsTimered == false} updateQuestionIndex={this.updateQuestionIndex} questionCount={props.quiz.questions.length} index={this.state.questionIndex} />
                        <QuestionBody setChoice={this.setChoice} index={this.state.questionIndex} question={this.getCurrentQuestion()} />
                        <QuestionNavigation enabled={quiz.questionsTimered == false} updateQuestionIndex={this.updateQuestionIndex} questionCount={props.quiz.questions.length} index={this.state.questionIndex} />
                    </Fragment>
                }
                <Modal title="Option">
                    <AnchorButton onClick={this.onSubmit} className="btn btn-primary" >Submit</AnchorButton>
                </Modal>
            </div>
        )
    }
}

const QuestionNavigation = (props: { enabled: boolean, index: number, updateQuestionIndex(index: number): any, questionCount: number }) => {
    const enabled = props.enabled;
    return (
        <div >
            <p />
            <div className="row container-fluid">
                <div className="col-5 text-center">
                    <AnchorWithIcon className="btn btn-secondary" children="Previous"
                        onClick={(e) => props.updateQuestionIndex(props.index - 1)} show={enabled && props.index > 0} iconClassName="fas fa-angle-left" />
                </div>
                <div className="col-2 text-center">
                    <p>Question: {props.index + 1} of {props.questionCount}</p>
                </div>
                <div className="col-5 text-center">
                    <AnchorWithIcon className="btn btn-secondary" children="Next"
                        onClick={(e) => props.updateQuestionIndex(props.index + 1)} show={enabled && props.index < props.questionCount - 1} iconClassName="fas fa-angle-right" />
                </div>
            </div>
            <p />
        </div>
    )
}

const QuestionBody = (props: { index: number, question: QuizQuestion, setChoice(code: string | undefined, index: number): any }) => {
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
const ChoiceItem = (props: { choice: QuizChoice, index: number, setChoice(code?: string): any, correctChoice: string | undefined, answered: boolean }) => {
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

