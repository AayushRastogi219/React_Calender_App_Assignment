import React from "react";
import Calendar from "./components/Calendar";
import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.state={
      userevent:'',
      enteredDate:'',
      enteredTime:'',
      showEvent:false,
      newDateFormat:'',
      usernewEvents:[],
      eventColor:'lightskyblue',
      applyEventColor:'',
      errorMessage:''
    }
  }

  handleOnChangeDate=(event)=>{
      this.setState({enteredDate:event.target.value})
  }
  handleOnChangeTime=(event)=>{
      this.setState({enteredTime:event.target.value})
  }

  onChangeUserEvent=(event)=>{
    this.setState({userevent:event.target.value})
  }

  onChangeEventColor=(event)=>{
    this.setState({eventColor:event.target.value})
  }

  onClickAddEvent=(event)=>{
    event.preventDefault()
    if(this.state.enteredDate !== '' && this.state.enteredTime !== '' &&  this.state.userevent !== '' && this.state.eventColor !== ''){
      let tempDate = this.state.enteredDate
      const [year, month, date] = [...tempDate.split('-')]
      const newFormat =this.props.allMonths[month-1]+' '+date+' '+year

      let tempEvent = this.state.userevent
      let tempAllUserEvents= this.state.usernewEvents
      tempAllUserEvents.push(tempEvent)
      const newEventColor= this.state.eventColor

      this.setState({showEvent:true,
        errorMessage:'',
        newDateFormat:newFormat,
        usernewEvents:tempAllUserEvents,
        applyEventColor:newEventColor
      })
    }
    else{
      this.setState({errorMessage:'Please mention all required event details'})
    }
  }
  getAllEvents=(events)=>{
    let eventData=[]
    for(let i=0; i<events.length; i++){
      eventData.push({id:i+1, eventName:events[i]})
    }
    return eventData;
  }

  onEditEvent=(row, cellName, cellValue)=>{
    let events = this.state.usernewEvents
    let eventData = this.getAllEvents(events)
    for(let i=0; i<eventData.length; i++){
      if(eventData[i].id === row.id){
        eventData[i].eventName = row.eventName
        events[i]=row.eventName
      } 
    }
    this.setState({usernewEvents:events})
  }

  onDeleteEvent=(rowKeys)=>{
    let events = this.state.usernewEvents
    let eventData = this.getAllEvents(events)
    for(let i=0; i<eventData.length; i++){
      if(eventData[i].id === rowKeys[0]){
        eventData.splice(i,1)
        events.splice(i,1)
      } 
    }
    this.setState({usernewEvents:events})
  }
  
  onSaveClick=(event)=>{
    let tempDate = this.state.enteredDate
    const [year, month, date] = [...tempDate.split('-')]
    const newFormat =this.props.allMonths[month-1]+' '+date+' '+year

    this.setState({applyEventColor:this.state.eventColor,
      newDateFormat:newFormat
    })
  }

  render() {
    return (
      <div className="App">
        <header>
          <div id="logo">
            <span className="icon">date_range</span>
            <span>
              react<b>calendar</b>App
            </span>
          </div>
        </header>

        <main>
          <form style={{marginBottom:10}}><b>Configure Event:</b>
            <hr></hr>
            <label style={labelStyle}>{this.props.dateLabel}</label>
            <input style={{margin:5, width:150}} type="date" name="bday" value={this.state.enteredDate} onChange={this.handleOnChangeDate}/>
            <div>
              <label style={labelStyle}>{this.props.timeLabel}</label>
              <input style={{margin:5}} type="time" name="usr_time" value={this.state.enteredTime} onChange={this.handleOnChangeTime} required/>
            </div>
            <div>
              <label style={labelStyle}>{this.props.eventLabel}</label>
              <input style={{margin:5, width:160}} type='text' placeholder='Event Name' value={this.state.userevent} onChange={this.onChangeUserEvent}/>
            </div>
            <div>
              <label style={labelStyle}>{this.props.colorLabel}</label>
              <input style={{margin:5}} type='color' value={this.state.eventColor} onChange={this.onChangeEventColor}/>
            </div>
            <div>
              <label style={labelStyle}>{this.props.buttonLabel}</label>
              <button style={{margin:5}} onClick={this.onClickAddEvent}>Add Event</button> 
              <p style={style}>{this.state.errorMessage}</p>
            </div>
          </form>

          <Calendar eventDate={this.state.newDateFormat} eventNames={this.state.usernewEvents} eventState={this.state.showEvent} eventTime={this.state.enteredTime} eventColor={this.state.applyEventColor} onAfterCellSave={this.onEditEvent} onAfterDeleteRow={this.onDeleteEvent} onEditColor={this.onChangeEventColor} colorValue={this.state.eventColor} onSaveButtonClick={this.onSaveClick} onEditDate={this.handleOnChangeDate} dateValue={this.state.enteredDate}/>
        </main>
      </div>
    );
  }
}

const labelStyle = {
 fontSize:'15px'
}

const style={
  color:"red",
  fontSize:'12px',
  marginLeft:'20px'
}

App.defaultProps={
  allMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  dateLabel:'1. Select date:*',
  timeLabel:'2. Select time:*',
  eventLabel:"3. Enter a event:*",
  colorLabel:'4. Select a color:*',
  buttonLabel:'5.'
}

export default App;
