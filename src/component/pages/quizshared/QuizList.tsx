
import React, { ChangeEvent, Component } from 'react';
import Quiz from './../../../models/Quiz';
import Card from './../../container/Card';
import { timerString } from './../../../utils/DateUtil';
import FormGroup from '../../form/FormGroup';
import Spinner from '../../loader/Spinner';
import ScrollDiv from '../../container/ScrollDiv';
import BaseComponent from './../../BaseComponent';
import { tableHeader } from './../../../utils/CollectionUtil';
import PublicQuizService from './../../../services/PublicQuizService';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
interface IProps { 
    skipAccessCode:boolean,
    loading:boolean, 
    onFilter(fieldsFilter:any):any|undefined, 
    quizList: Quiz[], 
    startingNumber: number,
    quizOnClick(quiz: Quiz): void };
class State {
    fieldsFilter:any = {}
}
class QuizList extends BaseComponent {
    state:State = new State();
    publicQuizService:PublicQuizService;
    constructor(props:IProps) {
        super(props);
        this.publicQuizService = this.getServices().publicQuizService;
    }
    updateFilter = (e:ChangeEvent) => {
        const fieldsFilter = this.state.fieldsFilter;
        const target = e.target as HTMLInputElement;
        fieldsFilter[target.name] = target.value;
        this.setState({fieldsFilter: fieldsFilter});
    }
    resetFilter = (e) => {
        this.setState({fieldsFilter: {}});
    }
    quizOnClick = (quiz:Quiz) => {
        if (quiz.protectedByCode && this.props.skipAccessCode != true) {
            this.validateAccessCode(quiz);
            return;
        }
        this.props.quizOnClick(quiz);
    }
    accessCodeValidated = (quiz:Quiz) => {
        this.props.quizOnClick(quiz);
    }
    validateAccessCode = (q:Quiz) => {
        const code = prompt("Enter access code");
        if (code == null) return;
        this.commonAjax(
            this.publicQuizService.validateAccessCode,
            ()=> this.accessCodeValidated(q),
            this.showCommonErrorAlert,
            q, code);
    }
    render() {
        const props = this.props;
        
        return (
            <Card>
                <form className="row" onSubmit={e=>{
                    e.preventDefault();
                    if ( this.props.onFilter) {
                        this.props.onFilter(this.state.fieldsFilter)
                    }
                }} >
                    <FormGroup className="col-6" label="Title">
                        <div className="input-group">
                            <input onChange={this.updateFilter} name="title" value={this.state.fieldsFilter['title']??""} type="text" placeholder="Search Title" className="form-control"/>
                            <div className="input-group-append">
                                <button type="submit" className="btn btn-dark">
                                    Search
                                </button>
                                <button onClick={this.resetFilter} type="reset" className="btn btn-warning">
                                    <i className="fas fa-redo"/>
                                </button>
                            </div>
                        </div>
                    </FormGroup>
                </form>
                <ScrollDiv>
                <table className="table table-striped">
                    {tableHeader("No", "Title", "Question","Duration","Status","Action")}
                    <tbody>
                        {props.loading?
                        <tr>
                            <td colSpan={6}>
                                <Spinner/>
                            </td>
                        </tr>
                        :
                        props.quizList.map((quiz:Quiz, i: number) => {
                            quiz = Object.assign(new Quiz(), quiz);
                            return (
                                <tr key={"quiz-public-list-" + i}>
                                    <td>{i + props.startingNumber + 1}</td>
                                    <td>{quiz.title}
                                    &nbsp;{quiz.questionsTimered?<i className="fas fa-stopwatch"/>:null}
                                   
                                    </td>
                                    <td>{quiz.getQuestionCount()}</td>
                                    <td>{timerString(quiz.duration)}</td>
                                    <td>
                                        {quiz.active?"Active":"Not active"}
                                        -
                                        {quiz.repeatable?"Repeatable":"Not repeatable"}
                                    </td> 
                                    <td>
                                        
                                        {quiz.available?<a onClick={(e) => this.quizOnClick(quiz)}
                                            className="btn btn-dark" >
                                            {quiz.protectedByCode?<i className="fas fa-lock"/>:<i className="fas fa-folder-open"/>}
                                            </a> :"Not available"}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                </ScrollDiv>
            </Card >
        )
    }
}

export default  withRouter(connect(
    mapCommonUserStateToProps
)(QuizList))