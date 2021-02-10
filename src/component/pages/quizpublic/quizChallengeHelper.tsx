import React, {Component } from 'react';
import { timerString } from './../../../utils/DateUtil';
import QuizResult from './../../../models/QuizResult';
import Modal from './../../container/Modal';
import AnchorButton from './../../navigation/AnchorButton';

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
