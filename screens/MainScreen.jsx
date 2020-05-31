import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Easing,
  Image,
} from "react-native";
import { fetchCurrent, mourn } from ".././utils/Airtable";
import { mourningStep } from ".././utils/Enumerations";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const { Value, timing, sequence, loop } = Animated;
const glow = require('.././assets/glow.png');
const info = require('.././assets/infoIcon.png');

export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      glowAnim: new Value(0),
      breathAnim: new Value(0),
      currentActives: 7583,
      isMourning: false,
    };
  }

  componentDidMount = async () => {
    await this.fetchAndSetCurrent();
  };

  fetchAndSetCurrent = async (isMourning = mourningStep.neutral) => {
    switch (isMourning) {
      case mourningStep.neutral:
        fetchCurrent()
          .then((response) => {
            if (response !== null) {
              console.log("Updating", response);
              this.setState({ currentActives: response });
            }
          })
          .catch((err) => console.log(err));
        break;
      case mourningStep.mourning:
        fetchCurrent()
          .then((response) => {
            if (response !== null) {
              mourn(response + 1).then((response) => {
                console.log("Mourning now,", response);
                this.setState(
                  { currentActives: response, isMourning: true },
                  this.updateCurrent
                );
              });
            }
          })
          .catch((err) => console.log(err));
        break;
      default:
        fetchCurrent()
          .then((response) => {
            if (response !== null) {
              mourn(response - 1).then((response) => {
                console.log("No longer mourning,", response);
                this.setState({ currentActives: response, isMourning: false });
              });
            }
          })
          .catch((err) => console.log(err));
    }
  };

  breathOut = () => {
    console.log("breathout");
  };

  updateCurrent = async () => {
    const { isMourning } = this.state;
    if (isMourning) {
      await this.fetchAndSetCurrent();
      setTimeout(this.updateCurrent, 3000);
    }
  };

  handlePress = async () => {
    const { glowAnim } = this.state;
    await timing(glowAnim, {
      toValue: 1,
      duration: 5000,
      easing: Easing.elastic(1),
    }).start();
    await this.fetchAndSetCurrent(mourningStep.mourning);
  };

  handleRelease = async () => {
    await this.fetchAndSetCurrent(mourningStep.stopped);
    const { glowAnim } = this.state;
    timing(glowAnim, {
      toValue: 0,
      duration: 5000,
      easing: Easing.elastic(1),
    }).start();
  };

  render() {
    const { navigation } = this.props;
    const { glowAnim, currentActives } = this.state;
    return (
      <Animated.View
        style={{
          ...styles.container,
          backgroundColor: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["#222222", "#143A56"],
          }),
        }}
      >
        <Animated.View style={{
          ...styles.infoContainer, opacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          })
        }}>
          <TouchableOpacity style={{ backgroundColor: 'gray', borderRadius: 100, opacity: 0.5, }} onPress={() => { navigation.navigate('Info') }}>
            <Image source={info} style={styles.infoImage} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ ...styles.topContainer, opacity: glowAnim }}>
          <Text style={styles.numberText}>{currentActives}</Text>
        </Animated.View>
        <View style={styles.bottomContainer}>
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.handlePress();
            }}
            onPressOut={() => {
              this.handleRelease();
            }}
          >
            <Animated.Image
              source={glow}
              resizeMode='cover'
              style={{
                ...styles.touchableContainer,
                width: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [120, 150],
                }),
                height: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [120, 150],
                }),
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
                marginBottom: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, hp(5)],
                }),
              }}
            >
            </Animated.Image>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#143A56",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoContainer: {
    width: wp(100),
    alignItems: 'flex-end',
    marginTop: hp(7.5),
    paddingHorizontal: wp(10),
  },
  infoImage: {
    width: 40,
    height: 40,
  },
  topContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    bottom: hp(15),
  },
  numberText: {
    fontSize: 64,
    fontFamily: "Helvetica Neue",
    color: "white",
    textAlignVertical: "center",
  },
  bottomContainer: {
    width: wp(100),
    height: hp(10),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(15),
  },
  touchableContainer: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
});
