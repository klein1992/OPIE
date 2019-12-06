import React, { Component } from "react";

//This stopwatch code is found here https://wsvincent.com/react-stopwatch/. Adapted to suit my needs.

class Stopwatch extends Component {
  state = {
    status: false,
    runningTime: 0
  };
  handleClick = () => {
    this.setState(state => {
      if (state.status) {
        clearInterval(this.timer);
      } else {
        const startTime = Date.now() - this.state.runningTime;
        this.timer = setInterval(() => {
          this.setState({ runningTime: Date.now() - startTime });
        });
      }
      this.notifyParent();
      return { status: !state.status };
    });
  };
  handleReset = () => {
    clearInterval(this.timer);
    this.setState({ runningTime: 0, status: false });
    this.notifyParent();
  };

  notifyParent = () => {
    this.props.callback(Math.floor(this.state.runningTime/ 1000), this.state.status);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const { status, runningTime } = this.state;
    return (
      <div>
        <p>{Math.floor(runningTime / 60000)}minutes</p>
        <p>{Math.floor(runningTime / 1000) % 60}seconds</p>

        <button className="btn btn-success" onClick={this.handleClick}>{status ? "Stop" : "Start"}</button>
        <button className="btn btn-warning" onClick={this.handleReset}>Reset</button>
      </div>
    );
  }
}
export default Stopwatch;
