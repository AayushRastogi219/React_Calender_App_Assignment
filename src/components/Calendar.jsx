import React from "react";
import dateFns from "date-fns";
import Modal from 'react-modal'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'

class Calendar extends React.Component {
  constructor(props){
    super(props)
    this.state={
      currentMonth: new Date(),
      selectedDate: new Date(),
      isActive:false
    }
    let isdateValid = false;
  }
 
  componentWillMount(){
    Modal.setAppElement('body')
  }

  editUserToggleModal=()=>{
    this.setState({isActive:!this.state.isActive})
  }

  getListOfEvents=(isdateValid)=>{
    let eventData=[]
    if(isdateValid){
      const events = this.props.eventNames
      for(let i=0; i<events.length; i++){
        eventData.push({id:i+1, eventName:events[i]})
      }
    }
    return eventData
  }
  
  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);
    let dateValid = false;
    const dateFormat = "D";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat)
        const cloneDay = day
        
        dateValid = (String(cloneDay).includes(this.props.eventDate) && this.props.eventState)
        if(dateValid) this.isdateValid =true

        days.push(
          <div title='Click to edit event' style={{backgroundColor: (dateValid)? this.props.eventColor : 'white'}}
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
          {(dateValid)? <ul style={ulStyle}><b style={{fontSize:12}}>{this.props.eventNames.map((item,i)=>{return(<li key={i}><i>{item}</i></li>)})}</b></ul> : ''}
          
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>

          </div>
        );
       
        day = dateFns.addDays(day, 1)
      }
      rows.push(
        <div className="row" key={day}>{days}</div>
      );
      days = [];
    }

    return <div className="body" >{rows}</div>;
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day,
      isActive:!this.state.isActive
    })
    
  }

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    const cellEditProp = {mode: 'click', blurToSave: true, afterSaveCell: this.props.onAfterCellSave}
    const options = {afterDeleteRow: this.props.onAfterDeleteRow}
    const selectRowProp = {mode:'radio', clickToEdit: true, bgColor: 'lightblue'};
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}

        <Modal style={CustomStyles} transparent={true} isOpen={this.state.isActive} onRequestClose={this.editUserToggleModal}>
          <div>
            <BootstrapTable data={this.getListOfEvents(this.isdateValid)} striped hover height={this.props.tableHeight} scrollTop={'Top'} hover={true} cellEdit={cellEditProp} options={options} deleteRow={true} selectRow={selectRowProp}>
              <TableHeaderColumn isKey dataField={this.props.dataIdField} width="100" tdStyle={{backgroundColor: 'green',color:'white'}}>Id</TableHeaderColumn>
              <TableHeaderColumn dataField={this.props.dataEventNameField}>{this.props.headerName}</TableHeaderColumn>
            </BootstrapTable>
          </div>
          <span style={colorpickerStyle}>
          <label style={labelStyle}>Update Date: </label>
            <input style={dateStyle} type="date" value={this.state.enteredDate} onChange={this.props.onEditDate}/>
            <label style={labelStyle}>Update color: </label>
            <input type='color' value={this.props.colorValue} onChange={this.props.onEditColor}/>
          </span>
          <span style={closeBtnStyle}>
            <button title={this.props.saveButtonToolip} onClick={this.props.onSaveButtonClick}>Save</button>
            <button title={this.props.closeButtonToolip} style={{marginLeft:5}} onClick={this.editUserToggleModal}>Close</button>
          </span>
        </Modal>
        
      </div>
    );
  }
}

const ulStyle = {
  float:'left',
  margin: 0,
  padding: 0,
  width: 100,
  color:'black'
}
const dateStyle = {
  marginRight:5,
  width:150
}

const closeBtnStyle = {
  float:'right',
  marginRight:2,
  marginBottom:2,
  marginTop:20
}
const colorpickerStyle = {
  float:'left',
  marginLeft:2,
  marginBottom:2,
  marginTop:20
}

Calendar.defaultProps={
  dataIdField:'id',
  dataEventNameField:'eventName',
  headerName:"Events",
  tableHeight:'290',
  saveButtonToolip:'Click to save changes',
  closeButtonToolip:'Close',
}

const CustomStyles = {
  overlay: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  
  },
  content : {
   top                   : '50%',
   left                  : '50%',
   right                 : 'auto',
   bottom                : 'auto',
   marginRight           : '-50%',
   transform             : 'translate(-50%, -50%)',
   width:'40%',
   height:'42%',
   borderRadius:'15px'
  }
}
const labelStyle = {
  fontSize:'15px'
 }

export default Calendar;
