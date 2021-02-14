import React, { ChangeEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import Quiz from './../../../models/Quiz';
import Card from '../../container/Card';
import QuizQuestion from './../../../models/QuizQuestion';
import AnchorButton from './../../navigation/AnchorButton';
import QuizService from './../../../services/QuizService';
import WebResponse from './../../../models/WebResponse';
import { QuestionForm, QuizInformationForm } from './QuizFormCompontnes';
import { toBase64v2 } from './../../../utils/ComponentUtil';

class IState {
    quiz: Quiz = new Quiz();
    saved: boolean = false;
    showChoices: boolean = true;
}

class QuizManagementForm extends BaseComponent {
    quizService: QuizService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, true);
        this.quizService = this.getServices().quizService;
    }
    componentDidMount() {
        this.validateLoginStatus();
        this.validateQuizFromProps();
        document.title = "Quiz Form";
    }
    validateQuizFromProps = () => {
        if (!this.props.location.state) return;
        const quiz = this.props.location.state.quiz;

        if (quiz) {
            this.setState({ quiz: Object.assign(new Quiz(), quiz) });
        }
    }
    reset = () => {
        this.showConfirmationDanger("Reset Quiz?").then((ok) => {
            if (!ok ) return;
            this.setState({ quiz: new Quiz() });
        })

    }
    updateQuizBooleanField = (name :string, value:boolean) => {
        const quiz: Quiz = this.state.quiz;
        quiz[name] = value;
        this.setState({ quiz: quiz });
    }
    updateQuizField = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        const quiz: Quiz = this.state.quiz;
        if (e.target.type == 'file') {
           const filePromise:Promise<String> =  toBase64v2(e.target);
           filePromise.then((data:String)=>{
               
                quiz[name] = data;
                this.setState({ quiz: quiz });
           })
        }
        quiz[name] = value;
        this.setState({ quiz: quiz });
    }
    addQuestion = (e) => {
        const quiz: Quiz = this.state.quiz;
        if (quiz.questions == undefined) {
            quiz.questions = [];
        }
        const question: QuizQuestion = QuizQuestion.publicQuizQuestion();
        question.statement = "Question " + (quiz.questions.length + 1);
        quiz.questions.push(question);
        this.setState({ quiz: quiz });
    }
    setAnswer = (code: string, questionIndex: number) => {
        const quiz: Quiz = this.state.quiz;
        if (quiz.questions == undefined) return;
        quiz.questions[questionIndex].answerCode = code;
        this.setState({ quiz: quiz });
    }
    updateQuestionField = (e: ChangeEvent) => {
        const target = e.target as any;
        if (!target) return;

        const index = parseInt(target.dataset['index'] ?? "0");
        const quiz: Quiz = this.state.quiz;
        if (quiz.questions == undefined) return;

        if (target.name == 'image') {
            toBase64v2(target).then(
                (imageString) => {
                    if (!quiz.questions || !imageString.startsWith("data:image")) return;
                    quiz.questions[index][target.name] = imageString;
                    this.setState({ quiz: quiz });
                }
            )
        } else {
            quiz.questions[index][target.name] = target.value;
            this.setState({ quiz: quiz });
        }
    }
    updateChoiceField = (e: ChangeEvent) => {
        const target = e.target as any;
        if (!target) return;

        const questionIndex = parseInt(target.dataset['questionindex'] ?? "0");
        const choiceIndex = parseInt(target.dataset['index'] ?? "0");
        const quiz: Quiz = this.state.quiz;
        const questions: QuizQuestion[] = quiz.questions ?? [];
        const question: QuizQuestion = questions[questionIndex];
        if (0 == questions.length || !question.choices) {
            return;
        }
        //update selected choice
        if (target.name == 'image') {
            toBase64v2(target).then(
                (imageString) => {
                    if (!question.choices || !imageString.startsWith("data:image")) return;
                    question.choices[choiceIndex][target.name] = imageString;
                    this.setState({ quiz: quiz });
                }
            )
        } else {
            question.choices[choiceIndex][target.name] = target.value;
            this.setState({ quiz: quiz });
        }
    }
    removeQuestion = (index: number) => {
        const quiz: Quiz = this.state.quiz;
        if (quiz.questions == undefined) return;
        quiz.questions.splice(index, 1);
        this.showConfirmationDanger("Remove Question?")
            .then((ok) => {
                if (ok) { this.setState({ quiz: quiz }); }
            });
    }
    removeQuestionImage = (index: number) => {
        const quiz: Quiz = this.state.quiz;
        if (!quiz.questions) return;
        if (quiz.questions[index]) {
            quiz.questions[index].nulledFields = ["image"];
            quiz.questions[index].image = undefined;
        }
        this.showConfirmationDanger("Remove Question Image?")
            .then((ok) => {
                if (ok) { this.setState({ quiz: quiz }); }
            });
    }
    removeChoiceImage = (index: number, questionIndex: number) => {
        const quiz: Quiz = this.state.quiz;
        const questions: QuizQuestion[] = quiz.questions ?? []
        const question: QuizQuestion = questions[questionIndex];
        if (0 == questions.length || !question.choices || !question.choices[index]) {
            return;
        }
        question.choices[index].image = undefined;
        question.choices[index].nulledFields = ["image"];
        this.showConfirmationDanger("Remove Choice Image?")
            .then((ok) => {
                if (ok) { this.setState({ quiz: quiz }); }
            });

    }
    removeAllQuestion = (e) => {
        const quiz: Quiz = this.state.quiz;
        this.showConfirmationDanger("Remove All Question?")
            .then((ok) => {
                quiz.questions = [];
                if (ok) { this.setState({ quiz: quiz }); }
            });
    }
    submitQuiz = (e) => {
        e.preventDefault();
        console.debug("QUIZ: ", this.state.quiz);

        this.showConfirmation(this.state.quiz.id ? "Update Quiz?" : "Create Quiz?").then((ok) => {
            if (ok) {
                this.doSubmitQuiz();
            }
        })
    }
    doSubmitQuiz = () => {
        this.commonAjaxWithProgress(
            this.quizService.submit, this.dataSaved,
            this.showCommonErrorAlert, this.state.quiz
        )
    }
    dataSaved = (response: WebResponse) => {
        this.showInfo("Success");
        if (response.quiz) {
            this.props.history.push("/quizmanagement/detail/" + response.quiz?.id);
        }
    }
    showChoices = () => { this.setState({showChoices:true}); }
    hideChoices = () => { this.setState({showChoices:false});  }
    render() {
        const quiz: Quiz = this.state.quiz;
        const questions: QuizQuestion[] = quiz.questions ?? [];
        return (
            <div id="QuizManagementForm" className="container-fluid">
                <h2>Quiz Form</h2>

                <form onSubmit={this.submitQuiz} >
                    <Card title="Quiz Form"> <QuizInformationForm quiz={quiz} updateQuizBooleanField={this.updateQuizBooleanField} updateField={this.updateQuizField} />
                    </Card>
                    <div className="btn-group" style={{ marginBottom: '5px', marginTop: '5px' }}>
                        <AnchorButton className="btn btn-secondary" iconClassName="fas fa-plus" onClick={this.addQuestion} >Question</AnchorButton>
                        <AnchorButton className="btn btn-danger" iconClassName="fas fa-times" onClick={this.removeAllQuestion} >Remove All Question</AnchorButton>
                        <AnchorButton className="btn btn-warning" onClick={this.reset}>Reset</AnchorButton>
                    </div>
                    <Card title={"Quiz Questions :" + (questions.length)}
                        footerContent={quiz.questions && quiz.questions.length > 0 ? <input type="submit" className="btn btn-success" value={quiz.id ? "Update" : "Create"} /> : null}
                    >
                        <AnchorButton show={this.state.showChoices == true} onClick={this.hideChoices} iconClassName="fas fa-angle-up">Hide Choices</AnchorButton>
                        <AnchorButton show={this.state.showChoices == false} onClick={this.showChoices} iconClassName="fas fa-angle-down">Show Choices</AnchorButton>
                        <p/>
                        { questions.map((question, i) => {
                            return (
                                <QuestionForm key={"quest-form-" + i}
                                    questionsTimered={quiz.questionsTimered}
                                    showChoices={this.state.showChoices}
                                    setAnswer={this.setAnswer}
                                    question={question} index={i}
                                    updateField={this.updateQuestionField} updateChoiceField={this.updateChoiceField}
                                    remove={this.removeQuestion}
                                    removeImage={this.removeQuestionImage} removeChoiceImage={this.removeChoiceImage}
                                />
                            )
                        }) }
                    </Card>
                    <p />
                </form>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizManagementForm))