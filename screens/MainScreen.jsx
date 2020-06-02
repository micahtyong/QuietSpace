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
  AppState,
} from "react-native";
import { Icon } from "react-native-elements";
import { fetchCurrent, fetchLives, mourn } from ".././utils/Airtable";
import { mourningStep } from ".././utils/Enumerations";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const { Value, timing, sequence, loop, parallel } = Animated;
const glow = require(".././assets/glow.png");
const info = require(".././assets/infoIcon.png");

export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      glowAnim: new Value(0),
      breathAnim: new Value(0),
      backgroundAnim: new Value(0),
      currentActives: 7583,
      lives: [],
      isMourning: false,
      currentName: "George Floyd",
      wasCounted: false,
    };
  }

  componentDidMount = async () => {
    AppState.addEventListener('change', this.handleAppStateChange);
    console.log("welcome back")
    await this.fetchAndSetCurrent();
    fetchLives().then((lives) => {
      if (lives !== null) {
        // console.log("Here are the lives lost", lives);
        this.setState({ lives });
      }
    });
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  };

  handleAppStateChange = async (nextAppState) => {
    const { isMourning } = this.state;
    if (nextAppState === 'inactive' && isMourning) {
      await this.fetchAndSetCurrent(mourningStep.stopped);
    }
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

  updateCurrent = async () => {
    const { isMourning } = this.state;
    if (isMourning) {
      await this.fetchAndSetCurrent();
      setTimeout(this.updateCurrent, 3000);
    }
  };

  handlePress = async () => {
    const { glowAnim, breathAnim, backgroundAnim, isMourning } = this.state;
    await parallel([
      timing(glowAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.elastic(0.5),
      }),
      timing(breathAnim, {
        toValue: 0.8,
        duration: 4000,
        easing: Easing.elastic(0.5),
      }),
      timing(backgroundAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.elastic(0.5),
      }),
    ]).start(async ({ finished }) => {
      if (finished) {
        this.breathOut();
        if (!isMourning) {
          await this.fetchAndSetCurrent(mourningStep.mourning);
        }
      }
    });
  };

  handleRelease = async () => {
    const { glowAnim, breathAnim, backgroundAnim, isMourning } = this.state;
    await parallel([
      timing(glowAnim, {
        toValue: 0,
        duration: 5000,
        easing: Easing.elastic(1),
      }),
      timing(breathAnim, {
        toValue: 0,
        duration: 5000,
        easing: Easing.elastic(1),
      }),
      timing(backgroundAnim, {
        toValue: 0,
        duration: 3000,
        easing: Easing.elastic(0.5),
      }),
    ]).start(async ({ finished }) => {
      if (finished && this.state.isMourning) { // Do not destructure this.state.isMourning. Value was updated in middle of func call.
        this.setState({ currentName: "George Floyd" });
        await this.fetchAndSetCurrent(mourningStep.stopped);
      }
    });
  };

  breathOut = async () => {
    const { glowAnim, breathAnim } = this.state;
    await parallel([
      timing(glowAnim, {
        toValue: 0.5,
        duration: 4000,
        easing: Easing.elastic(0.5),
      }),
      timing(breathAnim, {
        toValue: 0,
        duration: 4000,
        easing: Easing.elastic(0.5),
      }),
    ]).start(async ({ finished }) => {
      if (finished) {
        this.handlePress();
        this.changeName();
      }
    });
  };

  changeName = () => {
    const { lives } = this.state;
    this.setState({
      currentName: lives[Math.floor(Math.random() * lives.length)],
    });
  };

  render() {
    const { navigation } = this.props;
    const {
      glowAnim,
      breathAnim,
      backgroundAnim,
      currentActives,
      currentName,
    } = this.state;
    return (
      <Animated.View
        style={{
          ...styles.container,
          backgroundColor: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["#111111", "#263038"],
          }),
        }}
      >
        <Animated.View
          style={{
            ...styles.infoContainer,
            opacity: backgroundAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: "gray", borderRadius: 100, opacity: 0.5 }}
            onPress={() => {
              navigation.navigate("Info");
            }}
          >
            <Image source={info} style={styles.infoImage} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ ...styles.topContainer, opacity: glowAnim }}>
          <Text style={styles.titleText}>Remembering with you</Text>
          <Text style={styles.numberText}>{currentActives}</Text>
        </Animated.View>
        <Animated.View style={{ ...styles.nameContainer, opacity: breathAnim }}>
          <Text style={styles.titleText}>In loving memory of</Text>
          <Text style={styles.nameText}>{currentName}</Text>
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
            ></Animated.Image>
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
    position: "absolute",
    width: wp(100),
    alignItems: "flex-end",
    marginTop: hp(7.5),
    paddingHorizontal: wp(5),
  },
  infoImage: {
    width: 40,
    height: 40,
  },
  topContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(20),
  },
  nameContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 64,
    fontFamily: "Lora",
    color: "white",
    textAlignVertical: "center",
  },
  titleText: {
    color: "white",
    fontFamily: "Lora",
    fontSize: 20,
    marginBottom: hp(3),
  },
  nameText: {
    color: "white",
    fontFamily: "Lora",
    fontSize: 36,
    // bottom: hp(10),
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
