import React, { Component } from 'react'
import { timerString } from '../../../../utils/DateUtil';

interface Props {
    onTimeout(): any;
    duration: number;
    display?: string;
    latestUpdate?: Date;
}
class State {


}
export default class QuizTimer extends Component<Props, State> {
    tick: number = 0;
    state: State = new State();
    timeout: any = undefined;
    progressRef: React.RefObject<HTMLDivElement> = React.createRef();
    timerStringRef: React.RefObject<HTMLSpanElement> = React.createRef();
    constructor(props) {
        super(props);
    }

    updateTick = () => {

        this.resetTimeout();
        const duration = this.props.duration;
        let tick = this.tick;
        if (tick >= duration) {
            this.updateTickWithCallback(tick, this.props.onTimeout);
            return;
        };
        tick += 0.1;
        this.updateTickWithCallback(tick, this.updateTimerLoop);
    }

    updateTickWithCallback = (tick: number, callback: () => any) => {
        this.tick = tick;
        const width = (100 - this.tick * 100 / this.props.duration) + '%';
        if (this.progressRef.current) {
            this.progressRef.current.style.width = width;
        }
        if (this.timerStringRef.current) {
            const string = timerString(this.props.duration - Math.ceil(this.tick));
            this.timerStringRef.current.innerHTML = '<strong>'+string+'</strong>';

        }
        callback();
    }

    resetTick = () => {
        this.updateTickWithCallback(0, this.updateTimerLoop);
    }

    resetTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
    updateTimerLoop = () => {
        this.timeout = setTimeout(this.updateTick, 100);
    }
    render() {
        console.debug("update timer render");
         
        return (
            <div className="container-fluid text-center">
                <p><i className="fas fa-stopwatch"/>&nbsp;<span ref={this.timerStringRef}></span></p>
                <div className="progress" style={{ height: '5px' }}>
                    <div ref={this.progressRef} style={{ transitionDuration: '500ms', width:'0%' }} 
                    className="bg-dark"    ></div>
                </div>
                
                <p />
            </div>
        )
    }


}
