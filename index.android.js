/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Alert,
  TouchableHighlight,
  Text,
  View
} from 'react-native';

// requiring the react-native-sound package
var Sound = require('react-native-sound');

// setting up the sound for success
const success = new Sound('beep1.mp3', Sound.MAIN_BUNDLE, (e) => {});

// setting up the sound for failure
const fail = new Sound('beep2.mp3', Sound.MAIN_BUNDLE, (e) => {});


class ClickBox extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      backgroundColor: props.color,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      // changing color when props received
      backgroundColor: nextProps.color,
    })
  }

  render() {
    return(
      <TouchableHighlight style={{backgroundColor:this.state.backgroundColor, flex:1, borderColor: 'gainsboro', borderWidth: 2}} onPress={(i) => this.props.onPress(this.props.name)} underlayColor={this.props.underlayColor}>
      <View/>
      </TouchableHighlight>
      )
  }
}

class ScoreBox extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      score: props.score,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      // changing the display score when new score received
      score: nextProps.score,
    })
  }

  render() {
    return(
      <View style={{
        flex:1,justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'}}>
        <Text style={{fontFamily:'Helvetica'}}>
          Score: {this.state.score}
        </Text>
      </View>
      )
  }
}

export default class Game extends Component {

  state = {
    numOfBox: 1,
    // 0 means blue; 1 means yellow
    changeColor: [
    0
    ],
    score: 0,
    picked: false,
    canClick: true,
  }

  componentDidMount() {
    // using set interval to change color
    setInterval(() => {
      var colors = [];
      for(var i=0; i<this.state.numOfBox; i++)
        colors.push(0);
      if (!this.state.picked)
        // pick one of the boxes to change color
        colors[Math.floor(Math.random()*colors.length)] = 1;
      this.setState({
        numOfBox: this.state.numOfBox,
        changeColor: colors.slice(),
        score: this.state.score,
        picked: !this.state.picked,
        canClick: true,
      })
      // Alert.alert('Yo'+this.state.changeColor[0]);
    }, 700)
  }

  handleClick = (i) => {
    // getting the score into marks
    var marks = this.state.score;
    // determining how many score for each new box to appear
    var incre = 5;
    // check if the clicked box is yellow
    if (this.state.changeColor[i] == 1){
      success.play();
      // check if the player has already scored this yellow box
      if (this.state.canClick){
        // increasing box number every "incre" scores, stay at 1 box for negative score
        if (marks > 0){
          this.setState({
              numOfBox: (marks - (marks%incre)) / incre + 1,
              changeColor: this.state.changeColor,
              score: this.state.score + 1,
              picked: this.state.picked,
              canClick: false,
            });
        } else {
          this.setState({
              numOfBox: 1,
              changeColor: this.state.changeColor,
              score: this.state.score + 1,
              picked: this.state.picked,
              canClick: false,
            });
        }
      }
    } else {
      fail.play();
      if (marks > 0){
        this.setState({
            numOfBox: (marks - (marks%incre)) / incre + 1,
            changeColor: this.state.changeColor,
            score: this.state.score - 1,
            picked: this.state.picked,
            canClick: false,
          });
      } else {
        this.setState({
            numOfBox: 1,
            changeColor: this.state.changeColor,
            score: this.state.score - 1,
            picked: this.state.picked,
            canClick: false,
          });
      }
    };
  }

  render() {
      var boxes = [];
      for (var i=0; i<this.state.numOfBox; i++){
        if (this.state.changeColor[i]){
            // Alert.alert('Yo' + this.state.changeColor[i]);
            boxes.push(<ClickBox time={Math.random()*1000} key={i} name={i.toString()} color={'yellow'} onPress={(i) => this.handleClick(i)} underlayColor='gold'/>);
          } else {
            // Alert.alert('Yo' + this.state.changeColor[i]);
            boxes.push(<ClickBox time={Math.random()*1000} key={i} name={i.toString()} color={'skyblue'} onPress={(i) => this.handleClick(i)} underlayColor='steelblue'/>);
          }
      }
      return (
        <View style={{flex:1}}>
        <View style={{flex:20}}>
          {boxes}
        </View>
        <ScoreBox score={this.state.score}/>
        </View>
        );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Game', () => Game);
