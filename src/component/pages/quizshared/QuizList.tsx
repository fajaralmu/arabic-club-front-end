
import React, { Component } from 'react';
import Quiz from './../../../models/Quiz';
import Card from './../../container/Card';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import { timerString } from './../../../utils/DateUtil';
interface IProps { quizList: Quiz[], startingNumber: number, quizOnClick(quiz: Quiz): void };
export default class QuizList extends Component<any, IProps>{

    render() {
        const props = this.props;
        return (
            <Card>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Title</th>
                            <th>Question</th>
                            <th>Duration</th>
                            <th>Status</th> 
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.quizList.map((quiz:Quiz, i: number) => {
                            quiz = Object.assign(new Quiz(), quiz);
                            return (
                                <tr key={"quiz-public-list-" + i}>
                                    <td>{i + props.startingNumber + 1}</td>
                                    <td>{quiz.title}
                                    {quiz.questionsTimered?<i className="fas fa-stopwatch"/>:null}
                                    </td>
                                    <td>{quiz.getQuestionCount()}</td>
                                    <td>{timerString(quiz.duration)}</td>
                                    <td>
                                        {quiz.active?"Active":"Not active"}
                                        -
                                        {quiz.repeatable?"Repeatable":"Not repeatable"}
                                    </td> 
                                    <td>
                                        {quiz.available?<AnchorWithIcon onClick={(e) => props.quizOnClick(quiz)}
                                            className="btn btn-dark" iconClassName="fas fa-clipboard">
                                            Detail Quiz
                                            </AnchorWithIcon> :"Not available"}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Card >
        )
    }
}