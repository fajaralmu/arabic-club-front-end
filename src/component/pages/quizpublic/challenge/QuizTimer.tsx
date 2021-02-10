import React, { Component } from 'react'
import { timerString } from './../../../../utils/DateUtil';

interface Props {
    onTimeout(): any;
    duration: number;
    display?: string;
}
class State {

    tick: number = 0;
}
export default class QuizTimer extends Component<Props, State> {

    state: State = new State();
    timeout: any = undefined;
    constructor(props) {
        super(props);
    }

    updateTimer = () => {

        this.resetTimeout();
        const duration = this.props.duration;
        let tick = this.state.tick;
        if (tick >= duration) {
            this.setState({ tick: 0 }, this.props.onTimeout);
            return;
        };
        tick++;
        this.setState({ tick: tick }, this.beginTimer);
    }

    resetTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
    beginTimer = () => {
        this.timeout = setTimeout(this.updateTimer, 1000);
    }
    render() {
        const props = this.props;
        if (props.display == 'progress') {
            return <TimerProgress duration={props.duration} tick={this.state.tick} />
        }
        return (
            <Timer duration={props.duration} tick={this.state.tick} />
        )
    }
}

const TimerProgress = (props: { duration: number, tick: number }) => {
    const width = (props.tick*100 / props.duration)+'%';
    return (
        <div className="container-fluid text-center">
            <div className="progress" style={{height:'5px'}}>
                <div className="progress-bar" role="progressbar" style={{width: width}}  ></div>
            </div>
            <strong>{timerString(props.duration - props.tick)}</strong>
            <p/>
        </div>
    )
}


const Timer = (props: { duration: number, tick: number }) => {

    const seconds: number = props.duration - props.tick;
    let className;
    let iconClassName = seconds % 2 == 0 ? "fas fa-hourglass-end" : "fas fa-hourglass-start";
    if (seconds <= 15) {
        className = "bg-danger text-warning";

    } else {
        className = "bg-warning "
    }
    return <div className={className} style={{ fontSize: '1.7em', right: '10px', padding: '10px', position: 'fixed', zIndex: 1000 }}>
        <span style={{ marginRight: '10px' }}>
            <i className={iconClassName}></i>
        </span>
        <span>
            <b>{timerString(seconds)}</b>
        </span>
    </div>
}


