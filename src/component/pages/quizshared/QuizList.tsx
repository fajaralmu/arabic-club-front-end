
import React, { Component } from 'react';
import Quiz from './../../../models/Quiz';
import Card from './../../container/Card';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
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
                            <th>Description</th>
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
                                    <td>{quiz.title}</td>
                                    <td>{quiz.description}</td>
                                    <td>{quiz.getQuestionCount()}</td>
                                    <td>{quiz.duration} second(s)</td>
                                    <td>
                                        {quiz.active?"Active":"Not Active"}
                                        -
                                        {quiz.repeatable?"Repeatable":"Not Repeatable"}
                                    </td>
                                    <td>
                                        <AnchorWithIcon onClick={(e) => props.quizOnClick(quiz)}
                                            className="btn btn-dark" iconClassName="fas fa-clipboard">
                                            Detail Quiz
                                            </AnchorWithIcon>
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