import React, { Component } from 'react'
import { timerString } from './../../../../utils/DateUtil';
const emojiNumbers = [128336,128337,128338,128339,128340,128341,128342,128343,128344,128345,128346,128347];
interface Props {
    onTimeout(): any;
    duration: number; 
    latestUpdate:undefined| Date;
}
class State {

    tick: number = 0;
}
export default class QuizTimer extends Component<Props, State> {

    state: State = new State();
    timeout: any = undefined;

    emojiTick:number = 0;
    constructor(props) {
        super(props);
    }

    updateTick = () => {

        this.resetTimeout();
        const duration = this.props.duration;
        let tick = this.state.tick;
        if (tick >= duration) {
            this.setState({ tick: 0 }, this.props.onTimeout);
            return;
        };
        tick++;
        this.emojiTick ++;
        if (this.emojiTick >= emojiNumbers.length) {
            this.emojiTick = 0;
        }
        this.setState({ tick: tick }, this.updateTimerLoop);
    }

    resetTick = () => {
        this.setState({ tick: 0 }, this.updateTimerLoop);
    }

    resetTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
    updateTimerLoop = () => {
        this.timeout = setTimeout(this.updateTick, 1000);
    }
    render() {
        const props = this.props;
         
        return (
            <Timer emojiNumber={emojiNumbers[this.emojiTick]} latestUpdate={this.props.latestUpdate} duration={props.duration} tick={this.state.tick} />
        )
    }
}
 


const Timer = (props: { emojiNumber:number, latestUpdate:undefined|Date,duration: number, tick: number }) => {

    const seconds: number = props.duration - props.tick;
    let className;
    let emoji = "&#"+props.emojiNumber+";";
    if (seconds <= 15) {
        className = "bg-danger text-warning";

    } else {
        className = "bg-warning "
    }
    return <div className={className} style={{ fontSize: '1.7em', right: '10px', padding: '10px', position: 'fixed', zIndex: 1000 }}>
        <span style={{ marginRight: '10px' }} dangerouslySetInnerHTML={{__html: emoji}}/>
        <span>
            <b>{timerString(seconds)}</b>
        </span>
        {props.latestUpdate? 
        <p style={{fontSize:'0.5em'}}>Last Update: {props.latestUpdate.toLocaleString()}</p>:null}
    </div>
}


