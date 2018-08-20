import React from 'react';
import { AppState, StyleSheet, Text, View, Slider, TouchableOpacity, } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      remainingSeconds: 0,
      countdownTime: {},
      value: 15,
      step: 0,
    };
    this.timer = 0;
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      console.log(nextAppState)
    } else {
      console.log('App has gone to the background!')
      console.log(nextAppState)
    }
    this.setState({ appState: nextAppState });
  }

  change(value) {
    this.setState(() => {
      return {
        value: parseFloat(value),
      };
    });
  }

  onSetTimer = () => {
    this.setState({step: 1})
  }

  onConfirm = () => {
    this.setState({ step: 2 })
    this.startTimer()
  }

  onBack = () => {
    this.setState({ step: 0 })
    clearInterval(this.timer)
  }

  startTimer = () => {
    let seconds = this.state.value * 60
    this.setState({
      remainingSeconds: seconds,
      countdownTime: this.convertSeconds(seconds),
    })
    this.timer = setInterval(this.countDown, 1000);
  }

  countDown = () => {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.remainingSeconds - 1;
    this.setState({
      countdownTime: this.convertSeconds(seconds),
      remainingSeconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  convertSeconds = (totalSeconds) => {
    return time = {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: Math.ceil((totalSeconds % 3600) % 60),
    }
  }

  render() {
    const { value } = this.state;
    const setTimer =
        <View>
          <Text style={styles.text}>Set A Timer</Text>
          <Text style={styles.text}>{String(value)} Minute{value > 1 && 's'}</Text>
          <View style={styles.slider}>
            <Slider
              step={1}
              minimumValue={1}
              maximumValue={120}
              onValueChange={this.change.bind(this)}
              value={value}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onSetTimer}
          >
            <Text style={styles.text}>SET TIMER</Text>
          </TouchableOpacity>
        </View>

    const confirm =
        <View>
          <Text style={styles.text}>Set Timer For</Text>
          <Text style={styles.text}>{String(value)} Minute{value > 1 && 's'}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onConfirm}
          >
            <Text style={styles.text}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onBack}
          >
            <Text style={styles.text}>Back</Text>
          </TouchableOpacity>
        </View>

    const countdownTimer =
        <View>
          <Text style={styles.text}>Counting Down</Text>
          <Text style={styles.text}>
            <Text>{this.state.countdownTime.hours > 0 && this.state.countdownTime.hours + " : "}</Text>
          <Text>{this.state.countdownTime.minutes <= 9 && "0"}{this.state.countdownTime.minutes} : </Text>
            <Text>{this.state.countdownTime.seconds <= 9 && "0"}{this.state.countdownTime.seconds}</Text>
          </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onBack}
            >
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>
        </View>

    return (
      <View style={styles.container}>
        <View style={[styles.header, {flex: 2, backgroundColor: 'lightblue'}]}>
          <Text style={styles.title}>FOGAS</Text>
        </View>
        <View style={[styles.header, {flex: 8}]}>
          {this.state.step == 0 && setTimer}
          {this.state.step == 1 && confirm}
          {this.state.step == 2 && countdownTimer}
        </View>
        <View style={[styles.header, { flex: 1, backgroundColor: 'lightblue' }]}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slider: {
    // backgroundColor: 'lightblue',
    padding: 20,
    width: 275,

  },
  text: {
    fontSize: 40,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 15,
    margin: 10,
    width: 275,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
