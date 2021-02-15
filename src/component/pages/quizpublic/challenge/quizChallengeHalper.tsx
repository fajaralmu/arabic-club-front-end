import React from 'react';
import SimpleError from './../../../alert/SimpleError';
import AnchorWithIcon from './../../../navigation/AnchorWithIcon';
import Quiz from './../../../../models/Quiz';
import { baseImageUrl } from './../../../../constant/Url';
import { timerString } from './../../../../utils/DateUtil';
import Modal from './../../../container/Modal';
import QuizResult from './../../../../models/QuizResult';
import AnchorButton from './../../../navigation/AnchorButton';


export const RertyPage = (props:{retrySubmit:Function}) => {
    return (
        <SimpleError style={{ marginTop: '20px' }} >
                <h3>Error While Submitting Answer</h3>
                <AnchorWithIcon onClick={props.retrySubmit} iconClassName="fas fa-redo">Retry</AnchorWithIcon>
            </SimpleError>
    )
}

export const StatusTImeout = (props) => {
    return (
         <div style={{ marginTop: '20px', }} className="container-fluid">
                <SimpleError  ><i style={{ marginRight: '5px' }} className="fas fa-exclamation-circle" /> Timeout</SimpleError>
            </div>
    )
}

export const QuizLanding = (props:{quiz:Quiz, start:Function}) => {
    const quiz = props.quiz;
    return (
        <div style={{ marginTop: '20px', paddingTop: '20px' }} className="text-center container-fluid">
        <img height="250" src={quiz.image ? baseImageUrl() + quiz.image : "/logo192.png"} className="rounded-circle" />
        <h3><strong>{quiz.title}</strong></h3>
        <p>Duration: {timerString(quiz.duration)}</p>
        <p>Question: {quiz.getQuestionCount()}</p>
        <p />
        <AnchorWithIcon className="btn btn-dark" onClick={props.start} iconClassName="fas fa-play">Start</AnchorWithIcon>
    </div>
    )
}


export  const QuizResultInfo = (props: {quiz:Quiz, quizResult: QuizResult }) => {
    const quizResult = props.quizResult;
    return (<Modal title="Result">
        <h2 className="text-center">Your Score <strong className="text-primary">{quizResult.score.toFixed(2)}</strong></h2>
        <h4 className="text-center text-success">Correct Answer {quizResult.correctAnswer}</h4>
        <h4 className="text-center text-danger">Wrong Answer {quizResult.wrongAnswer}</h4>
        <div className="text-center">
            {props.quiz.repeatable?
            <AnchorButton onClick={()=>{
                window.location.reload()
            }} iconClassName="fas fa-redo">Reload Try Again</AnchorButton>
            :
            <h4>Thanks for Participating</h4>
        }
        </div>
    </Modal>
    )
}