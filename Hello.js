import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import firebase from './resource/fire.js';
import MaterialTable from 'material-table';
import Icons from '@material-ui/icons'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Add from '@material-ui/icons/Add'
import Check from '@material-ui/icons/Check'
import FilterList from '@material-ui/icons/FilterList'
import Remove from '@material-ui/icons/Remove'
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import AddBox from '@material-ui/icons/AddBox';

class Quiz extends React.Component {
  constructor(props){
    this.state = {
      name: "",
      empNo:"",
      assetId:"",
      voipId:"",
      data: [
      { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
      {
        name: 'Zerya Betül',
        surname: 'Baran',
        birthYear: 2017,
        birthCity: 34,
      }],
      columns: [
      { title: 'Name', field: 'name' },
      { title: 'Surname', field: 'surname' },
      { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
      {
        title: 'Birth Place',
        field: 'birthCity',
        lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
      },
    ]
    }
  }

  componentWillMount() {
      firebase.auth().signInAnonymously().catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
      });
      const shoppingListDB = firebase.database().ref()
      const question = shoppingListDB.child("Question Tag");
      var shoppingListTemp=[];
      var item;
      question.on('value', snapshot => {
      
      snapshot.forEach(childSnapShot => {
        console.log( childSnapShot.key + " : "  + childSnapShot.val());
  
        item = 
        {
            [childSnapShot.key]: childSnapShot.key,
            name: childSnapShot.val()
        }

        //Add an item object to the shoppingListTemp Array
        shoppingListTemp.push(item);
      })
      console.log(item);
      })
  }

  startCounter = event =>{
    this.setState({ counter: 60, start : true, timerCount : this.state.timerCount+1, value : this.state.timerCount+1 < 4 || this.state.timerCount+1 > 15 ? this.state.value : (this.state.timerCount)%3 === 0 ? this.state.value+1 : this.state.value })
    this.timerId = setInterval(() => {
      this.setState({ counter: this.state.counter-1 }); 
    }, 1000)
    this.timeoutId = setTimeout(() => { clearInterval(this.timerId); this.incrementQuestion() }, 60*1000);
  }

  incrementQuestion = event => {
      if(this.state.timerCount < 15){
        this.startCounter();
      }
  }

  prepareWeekReport = event => {
    var weekData = [...this.state.weekScoreCard];
    weekData[1].push(this.state.team1)
    weekData[2].push(this.state.team2)
    weekData[3].push(this.state.team3)
    this.setState({ weekScoreCard: weekData });
  }

  handleChange = (event, newValue) => {
    this.setState({ value : newValue});
  }

  handleNext = event =>{
    if(this.state.round === 1){
      this.prepareWeekReport();
    }
    this.setState({ round : this.state.round + 1});
  }

  handleSubmit = (teamScore , value, teamName, round, selAns) =>{
    clearTimeout(this.timeoutId);
    clearInterval(this.timerId);
    var queData = [...this.state.questionData];
    queData.map(val =>{
      if(val.TeamName === teamName && val.Round === round){
        val.SelectedAnswer = selAns
      }
    })
    this.setState({ [teamScore]: this.state[teamScore] + (Math.ceil(this.state.counter/12)*value) , questionData: queData }, () => {this.startCounter()})
  }

  render(){
    return(
      <MaterialTable
      title="Asset ID"
      columns={this.state.columns}
      icons={{ 
                        Check: () => <Check />,
                        Add: () => <AddBox/>,
                        Clear: () => <Clear />,
                        ResetSearch: () => null,
                        Delete: () => null,
                        Edit: () => <Edit/>,
                        Export: () => <SaveAlt />,
                        Filter: () => <FilterList />,
                        FirstPage: () => <FirstPage />,
                        LastPage: () => <LastPage />,
                        NextPage: () => <ChevronRight />,
                        PreviousPage: () => <ChevronLeft />,
                        Search: () => null,
                        ThirdStateCheck: () => <Remove />,
                        ViewColumn: () => <ViewColumn />,
                        DetailPanel: () => <ChevronRight />,
                      }}
      data={this.state.data}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...this.state.data];
              data.push(newData);
              this.setState({ data });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...this.state.data];
              data[data.indexOf(oldData)] = newData;
              this.setState({ data });
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...this.state.data];
              data.splice(data.indexOf(oldData), 1);
              this.setState({ data });
            }, 600);
          }),
      }}
    />
    )
  }   
}
export default Quiz;