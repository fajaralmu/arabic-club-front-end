import React, {Component } from 'react';
import { timerString } from './../../../utils/DateUtil';
import QuizResult from './../../../models/QuizResult';
import Modal from './../../container/Modal';
import AnchorButton from './../../navigation/AnchorButton';

export  const Timer = (props: { duration: number, tick: number }) => {

    const seconds :number = props.duration - props.tick;
    let className;
    let iconClassName = seconds%2 == 0? "fas fa-hourglass-end" : "fas fa-hourglass-start";
    if (seconds <= 15) {
        className="bg-danger text-warning";
        
    } else {
        className="bg-warning "
    }
    return <div className={className}style={{ fontSize: '1.7em', right: '10px', padding: '10px', position: 'fixed', zIndex: 1000 }}>
        <span style={{ marginRight: '10px' }}>
            <i className={iconClassName}></i>
        </span>
        <span>
            <b>{timerString(seconds)}</b>
        </span>
    </div>
}

export  const QuizResultInfo = (props: { quizResult: QuizResult, tryAgain: any }) => {
    const quizResult = props.quizResult;
    return (<Modal title="Result">
        <h2 className="text-center">Your Score <strong className="text-primary">{quizResult.score.toFixed(2)}</strong></h2>
        <h4 className="text-center text-success">Correct Answer {quizResult.correctAnswer}</h4>
        <h4 className="text-center text-danger">Wrong Answer {quizResult.wrongAnswer}</h4>
        <div className="text-center">
            <AnchorButton onClick={props.tryAgain} iconClassName="fas fa-sync-alt">Try Again</AnchorButton>
        </div>
    </Modal>
    )
}
