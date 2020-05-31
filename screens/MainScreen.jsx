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
      currentActives: 7583,
      lives: [],
      isMourning: false,
      currentName: "George Floyd",
    };
  }

  componentDidMount = async () => {
    await this.fetchAndSetCurrent();
    fetchLives().then((lives) => {
      if (lives !== null) {
        console.log("Here are the lives lost", lives);
        this.setState({ lives });
      }
    });
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

  handlePress = async (isSameSession) => {
    const { glowAnim, breathAnim } = this.state;
    await parallel([
      timing(glowAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.elastic(1),
      }),
      timing(breathAnim, {
        toValue: 0.35,
        duration: 5000,
        easing: Easing.elastic(1),
      }),
    ]).start(({ finished }) => {
      if (finished) {
        this.breathOut();
      }
    });
    if (!isSameSession) {
      await this.fetchAndSetCurrent(mourningStep.mourning);
    }
  };

  handleRelease = async () => {
    await this.fetchAndSetCurrent(mourningStep.stopped);
    const { glowAnim, breathAnim } = this.state;
    parallel([
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
    ]).start(({ finished }) => {
      if (finished) {
        this.setState({ currentName: "George Floyd" });
      }
    });
  };

  breathOut = async () => {
    const { glowAnim, breathAnim } = this.state;
    await parallel([
      timing(glowAnim, {
        toValue: 0.75,
        duration: 3000,
        easing: Easing.elastic(1),
      }),
      timing(breathAnim, {
        toValue: 0,
        duration: 3000,
        easing: Easing.elastic(1),
      }),
    ]).start(({ finished }) => {
      if (finished) {
        this.handlePress(true);
        this.changeName();
      } else {
        this.handleRelease();
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
    const { glowAnim, breathAnim, currentActives, currentName } = this.state;
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
        <Animated.View
          style={{
            ...styles.infoContainer,
            opacity: glowAnim.interpolate({
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
          <Text style={styles.numberText}>{currentActives}</Text>
        </Animated.View>
        <Animated.View style={{ ...styles.nameContainer, opacity: breathAnim }}>
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
          <Icon
            raised
            reverse
            containerStyle={styles.infoContainer}
            name='info'
            type='font-awesome'
            color='#246696'
            onPress={() => {
              navigation.navigate("Info");
            }}
          />
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
    marginTop: hp(20),
  },
  numberText: {
    fontSize: 64,
    fontFamily: "Helvetica Neue",
    color: "white",
    textAlignVertical: "center",
  },
  nameText: {
    color: "white",
    fontSize: 24,
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
  infoContainer: {
    bottom: -80,
    alignSelf: "flex-end",
  },
});
