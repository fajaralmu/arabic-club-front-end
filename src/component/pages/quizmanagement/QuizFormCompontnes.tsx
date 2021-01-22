import React, { Fragment } from 'react';
import Quiz from '../../../models/Quiz';
import QuizChoice from './../../../models/QuizChoice';
import QuizQuestion from './../../../models/QuizQuestion';
import FormGroup from './../../form/FormGroup';
import AnchorButton from './../../navigation/AnchorButton';


export const ChoiceForm = (props: { answerCode: string, choice: QuizChoice, updateField: any, index: number, questionIndex: number }) => {
    return (
        <div>
            <div className={"input-group " + (props.answerCode == props.choice.answerCode ? "border border-primary" : "")}>
                <div className="input-group-prepend">
                    <span className="input-group-text" ><b>{props.choice.answerCode}</b></span>
                </div>
                <input name='statement' onChange={props.updateField} className="form-control" data-questionindex={props.questionIndex} data-index={props.index} value={props.choice.statement} required />
            </div>
        </div>
    )
}
export const QuestionForm = (props: { question: QuizQuestion, index: number, updateField: any, updateChoiceField: any, remove: any }) => {
    const i = props.index;
    const choices: QuizChoice[] = props.question.choices ?? [];
    return (
        <div className="alert alert-info" key={"quiz-quest-form-" + i}>
            <FormGroup label={"Question #" + (i + 1)}>
                <input required onChange={props.updateField} value={props.question.statement} className="form-control" name="statement" data-index={i} />
            </FormGroup>
            <FormGroup label="Choices">
                {choices.map((choice, c) => {
                    return <ChoiceForm answerCode={props.question.answerCode ?? "A"} key={"statement-choice-" + c + i} updateField={props.updateChoiceField} questionIndex={i} index={c} choice={choice} />
                })}
            </FormGroup>
            <FormGroup label="Answer">
                <select required className="form-control" value={props.question.answerCode} onChange={props.updateField} name="answerCode" data-index={i} >
                    {QuizQuestion.public_choices.map((code, c) => {
                        return <option key={"opt-ch-ans-" + c + i} value={code} >{code}</option>
                    })}
                </select>
            </FormGroup>
            <FormGroup>
                <AnchorButton iconClassName="fas fa-times" className="btn btn-danger" onClick={(e) => { props.remove(props.index) }} ></AnchorButton>
            </FormGroup>
        </div>
    )
}
export const QuizInformationForm = (props: { quiz: Quiz, updateField: any }) => {
    return (
        <Fragment>
            <FormGroup label="Title">
                <input required onChange={props.updateField} className="form-control" name="title" value={props.quiz.title} />
            </FormGroup>
            <FormGroup label="Description">
                <textarea required onChange={props.updateField} className="form-control" name="description" value={props.quiz.description} />
            </FormGroup>

        </Fragment>
    )
}
