import React, { Fragment } from 'react';
import Quiz from '../../../models/Quiz';
import QuizChoice from './../../../models/QuizChoice';
import QuizQuestion from './../../../models/QuizQuestion';
import FormGroup from './../../form/FormGroup';
import AnchorButton from './../../navigation/AnchorButton';
import { baseImageUrl } from './../../../constant/Url';


export const ChoiceForm = (props: { answerCode: string, choice: QuizChoice, updateField(e:any):void, setAnswer (code:string, index:number):void, removeImage:any, index: number, questionIndex: number }) => {
    return (
        <div>
            <div className={"input-group " + (props.answerCode == props.choice.answerCode ? "border border-primary" : "")}>
                <div className="input-group-prepend">
                    <span
                    onClick={(e)=>{
                        props.setAnswer(props.choice.answerCode??"", props.questionIndex)
                    }}
                    className={"clickable input-group-text "+(props.answerCode == props.choice.answerCode ? "bg-primary text-white":"")} ><b>{props.choice.answerCode}</b></span>
                </div>
                <input name='statement' onChange={props.updateField} className="form-control" data-questionindex={props.questionIndex} data-index={props.index} value={props.choice.statement} required />
            </div>
            <input type="file" name="image" accept="image/*" onChange={props.updateField}  data-questionindex={props.questionIndex} data-index={props.index} className="form-control" />
            <ImagePreview name={props.choice.image} index={props.index} remove={props.removeImage} />
            {props.choice.id? <label>Record Id: {props.choice.id}</label>:null}
        </div>
    )
}
export const QuestionForm = (props: {showChoices:boolean, question: QuizQuestion, index: number, updateField: any, updateChoiceField: any, remove: any, removeImage:any, removeChoiceImage:any, setAnswer(code:string, index:number):void }) => {
    const i = props.index;
    const choices: QuizChoice[] = props.question.choices ?? [];
    return (
        <div className="alert alert-info" key={"quiz-quest-form-" + i}>
            <FormGroup label={"Question #" + (i + 1)}>
                <input required onChange={props.updateField} value={props.question.statement} className="form-control" name="statement" data-index={i} />
            </FormGroup>
            <FormGroup label="Image">
                <input type="file"  accept="image/*" onChange={props.updateField} name="image" className="form-control" data-index={i}  />
               
                <ImagePreview name={props.question.image} index={i} remove={props.removeImage} />
            </FormGroup>
            
            <FormGroup label="Choices">
                {props.showChoices?choices.map((choice, c) => {
                    return <ChoiceForm answerCode={props.question.answerCode ?? "A"} key={"qst-choice-" + c +"-" + i}
                     updateField={props.updateChoiceField}
                     setAnswer={props.setAnswer}
                     removeImage={(choiceIndex)=>{props.removeChoiceImage(choiceIndex, i)}}
                     questionIndex={i} index={c} choice={choice} />
                }):<label>Hidden</label>}
            </FormGroup>
             
            <FormGroup label="Answer">
                <select required className="form-control" value={props.question.answerCode} onChange={(e)=>{
                    props.setAnswer(e.target.value, i);
                }} name="answerCode" data-index={i} >
                    {QuizQuestion.public_choices.map((code, c) => {
                        return <option key={"opt-ch-ans-" + c + i} value={code} >{code}</option>
                    })}
                </select>
            </FormGroup>
            {props.question.id?
            <FormGroup label="Record ID">
                {props.question.id}
            </FormGroup>:null
            }
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
            <FormGroup label="Duration (Second)">
                <input type="number" min={45} required onChange={props.updateField} className="form-control" name="duration" value={props.quiz.duration} />
            </FormGroup>
            {props.quiz.id?
            <FormGroup label="Record ID">
                {props.quiz.id}
            </FormGroup>:null
            }
        </Fragment>
    )
}

const ImagePreview = (props:{name:string|undefined, index:number, remove:any}) => {
    if (!props.name ) return null;
    const link = props.name.includes("data:image")?props.name:baseImageUrl()+props.name;
    return <div  >
        <img width="100" src={link} />
        <a style={{marginLeft:'5px' }} onClick={(e)=>props.remove(props.index)} className="btn btn-danger btn-sm"  ><i className="fas fa-times"/></a>
    </div>
}
