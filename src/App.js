import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/table";
import Stopwatch from "./components/stopwatch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tests: [],
      patients: [],
      timerStopped: false,
      timeInSeconds: 0,
      //the default patient id is 1
      selectedPatient: 1,
      testsRetrieved: false,
      noteInput: ''
    };
    this.getPatients = this.getPatients.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showTests = this.showTests.bind(this);
    this.getTests = this.getTests.bind(this);
  }

  showTests() {
    console.log(this.state.tests + "ShowTests was called");
    const displayTests = (
      <div style={{ marginTop: "50px" }}>
        <h4 class="card-subtitle mb-2 text-muted" id="title">
          Patient Tests
        </h4>
        <Table striped bordered hover size="sm" id="tests">
          <thead>
            <tr>
              <th>Test Type</th>
              <th>Date Taken</th>
              <th>Duration</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>{this.renderPatientTests()}</tbody>
        </Table>
      </div>
    );
    if (this.state.tests.length === 0 && this.state.testsRetrieved)
      return <h3>No Tests Exist for this Patient</h3>;
    else if (this.state.tests.length === 0) return null;
    else return displayTests;
  }

  getTests() {
    console.log("patient selected" + this.state.selectedPatient);
    fetch(
      "https://opie20191205111637.azurewebsites.net/api/test/patient/" +
        this.state.selectedPatient
    )
      .then(res => res.json())
      .then(data => {
        this.setState(state => ({ tests: data }));
      })
      .catch(console.log);
  }

  getPatients() {
    fetch("https://opie20191205111637.azurewebsites.net/api/patient")
      .then(res => res.json())
      .then(data => {
        this.setState(state => ({ patients: data }));
      })
      .catch(console.log);
  }

  postTest(test) {
    fetch("https://opie20191205111637.azurewebsites.net/api/test/" + test.Taken_By, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(test)
    });
  }

  handleSubmit(event) {
    if (this.state.timeInSeconds === 0 && this.state.timerStopped)
      alert("Cannot save test if test was not initiated or reset.");
      else if (!this.state.timerStopped)
      alert("Cannot save an ongoing test!")
    //note that I have hardcoded the test type (the client project only deals with one test type)
    //note that I have harcoded the facility (the client project will only be called from a "test" facility)
    else {
      const testToSendToAPI = {
        Taken_By:
          this.state.selectedPatient,
        Time_Taken: new Date(),
        Notes:
          this.state.noteInput === undefined ? null : this.state.noteInput,
        Duration: this.state.timeInSeconds,
        Test_Type_Id: 1,
        Taken_At: 1
      };
      this.postTest(testToSendToAPI);
      console.log(testToSendToAPI);
    }
  }

  renderPatientTests() {
    console.log("renderPatientTests Was called");
    if (this.state.tests === null) return;
    return this.state.tests.map((test, index) => {
      const { Test_Name, Time_Taken, Test_Instance_Id, Duration, Notes } = test;
      return (
        <tr key={Test_Instance_Id}>
          <td>{Test_Name}</td>
          <td>{Time_Taken}</td>
          <td>{Duration}</td>
          <td>{Notes}</td>
        </tr>
      );
    });
  }
  componentDidMount() {
    //by default we want a list of Patients
    this.getPatients();
  }

  render() {
    const { patients } = this.state;
    const testsToDisplay = this.showTests();
    return (
      <div>
        <div className="card" style={{ backgroundColor: "LightSkyBlue" }}>
          <div className="card-body">
            <h5 className="card-title">Opie Coding Challenge</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              Timed 10 Meter Walk Test
            </h6>
          </div>
        </div>

        
        <p>Please select a Patient: </p>
        <select value={this.state.selectedPatient} onChange={(event) => (this.setState({selectedPatient: event.target.value, testsRetrieved : false}))}>
          
          {patients.map((patient, index) => (
            <option
              key={index}
              value={patient.PatientId}
            >
              {patient.PatientId +
                " - " +
                patient.First_Name +
                " " +
                patient.Last_Name}
            </option>
          ))}
        </select>

        <p>Test Notes: </p>
        <input type="text" className=".col-md-4" value={this.state.noteInput} onChange={(event) => (this.setState({noteInput: event.target.value}))   }></input>
        <Stopwatch
          callback={(seconds, status) => this.setState({timerStopped: status, timeInSeconds: seconds})}
        ></Stopwatch>

        <Button style={{ marginTop: "50px" }} onClick={this.handleSubmit}>Save Test</Button>
        <Button
          style={{ marginTop: "50px", marginLeft: "10px" }}
          type="submit"
          onClick={() => {
            this.getTests();
            this.setState({testsRetrieved: true})
          }}
        >
          Display All Tests for This Patient
        </Button>
        <div>{testsToDisplay}</div>
      </div>
    );
  }
}

export default App;
