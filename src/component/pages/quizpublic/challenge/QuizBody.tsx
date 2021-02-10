import React, { Component } from 'react'
import Quiz from './../../../../models/Quiz';
import FormGroup from './../../../form/FormGroup';
import QuizQuestion from './../../../../models/QuizQuestion';
import QuizChoice from './../../../../models/QuizChoice';
import Modal from './../../../container/Modal';
import AnchorButton from './../../../navigation/AnchorButton';
import Card from './../../../container/Card';
import { baseImageUrl } from './../../../../constant/Url';
interface Props {
    quiz: Quiz, setChoice(code:string|undefined, questionIndex:number): any, submit(e): any
}
export default class QuizBody extends Component<Props, any> {

    constructor(props) {
        super(props);
    }

    render() {

        const props = this.props;
        const quiz = props.quiz;
        const questions: QuizQuestion[] = quiz.questions ?? [];
        return (
            <div>
                <h1>Quiz : {quiz.title}</h1>
                <div className='alert alert-info'>
                    <FormGroup label="Started at">
                        {quiz.startedDate? new Date(quiz.startedDate).toLocaleString():"-"}
                    </FormGroup>
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
}
const QuestionBody = (props: { index: number, question: QuizQuestion, setChoice(code:string|undefined, index:number): any }) => {
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
const ChoiceItem = (props: { choice: QuizChoice, index: number, setChoice(code?:string): any, correctChoice: string | undefined, answered: boolean }) => {
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

