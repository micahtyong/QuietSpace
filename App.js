import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, TouchableWithoutFeedback, Easing } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { Value, timing } = Animated

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      glowAnim: new Value(0),
    };
  }

  handlePress = () => {
    const { glowAnim } = this.state;
    timing(glowAnim, {
      toValue: 1,
      duration: 5000,
      easing: Easing.elastic(1)
    }).start()
  }

  handleRelease = () => {
    const { glowAnim } = this.state;
    timing(glowAnim, {
      toValue: 0,
      duration: 5000,
      easing: Easing.elastic(1)
    }).start()
  }

  render() {
    const { glowAnim } = this.state;
    return (
      <View style={styles.container}>
        <Animated.View style={{ ...styles.topContainer, opacity: glowAnim }}>
          <Text style={styles.numberText}>7383</Text>
        </Animated.View>
        <View style={styles.bottomContainer}>
          <TouchableWithoutFeedback
            onPressIn={() => { this.handlePress() }}
            onPressOut={() => { this.handleRelease() }}>
            <Animated.View style={{
              ...styles.touchableContainer,
              width: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [75, 110]
              }),
              height: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [75, 110]
              }),
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              })
            }}>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#143A56',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(25),
  },
  numberText: {
    fontSize: 64,
    fontFamily: 'Helvetica Neue',
    color: 'white',
    textAlignVertical: 'center'
  },
  bottomContainer: {
    width: wp(100),
    height: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(15),
  },
  touchableContainer: {
    backgroundColor: 'gold',
    width: 75,
    height: 75,
    borderRadius: 100,
  }
});
