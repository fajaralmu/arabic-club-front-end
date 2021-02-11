
import React, { ChangeEvent, Component } from 'react';
import Quiz from './../../../models/Quiz';
import Card from './../../container/Card';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import { timerString } from './../../../utils/DateUtil';
import FormGroup from '../../form/FormGroup';
interface IProps { onFilter(fieldsFilter:any):any|undefined, quizList: Quiz[], startingNumber: number, quizOnClick(quiz: Quiz): void };
class State {
    fieldsFilter:any = {}
}
export default class QuizList extends Component<IProps, State>{
    state:State = new State();
    constructor(props) {
        super(props);
    }
    updateFilter = (e:ChangeEvent) => {
        const fieldsFilter = this.state.fieldsFilter;
        const target = e.target as HTMLInputElement;
        fieldsFilter[target.name] = target.value;
        this.setState({fieldsFilter: fieldsFilter});
    }
    render() {
        const props = this.props;
        return (
            <Card>
                <form onSubmit={e=>{
                    e.preventDefault();
                    if ( this.props.onFilter) {
                        this.props.onFilter(this.state.fieldsFilter)
                    }
                }} >
                    <FormGroup label="Title">
                        <div className="input-group">
                            <input onChange={this.updateFilter} name="title" value={this.state.fieldsFilter['title']??""} type="text" placeholder="Search Title" className="form-control"/>
                            <div className="input-group-append">
                                <button type="submit" className="btn btn-dark">
                                    Search
                                </button>
                            </div>
                        </div>
                    </FormGroup>
                </form>
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