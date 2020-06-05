import React, { useCallback } from "react";
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
  Linking,
} from "react-native";
import { fetchCurrent, fetchLives, mourn } from ".././utils/Airtable";
import { mourningStep } from ".././utils/Enumerations";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const { Value, timing, parallel, sequence } = Animated;
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
      totalUses: 10000,
      lives: [],
      isMourning: false,
      currentName: "George Floyd",
      currentLink:
        "https://news.sky.com/story/who-was-george-floyd-the-gentle-giant-who-loved-his-hugs-11997206",
      wasCounted: false,
    };
  }

  componentDidMount = async () => {
    AppState.addEventListener('change', this.handleAppStateChange);
    console.log('welcome back');
    await this.fetchAndSetCurrent();
    fetchLives().then((lives) => {
      if (lives !== null) {
        this.setState({ lives });
      }
    });
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    console.log('unmounting')
  }

  handleAppStateChange = async (nextAppState) => {
    console.log(this.state.isMourning)
    const { isMourning } = this.state;
    if (nextAppState === 'inactive' && isMourning) {
      await this.fetchAndSetCurrent(mourningStep.stopped);
    } else if (nextAppState === 'active') {
      console.log("Returning to app")
    }
  };

  fetchAndSetCurrent = async (isMourning = mourningStep.neutral) => {
    switch (isMourning) {
      case mourningStep.neutral:
        fetchCurrent()
          .then((response) => {
            if (response !== null) {
              console.log("Updating", response);
              const { current, total } = response;
              this.setState({ currentActives: current, totalUses: total });
            }
          })
          .catch((err) => console.log(err));
        break;
      case mourningStep.mourning:
        fetchCurrent()
          .then((response) => {
            if (response !== null) {
              const { current, total } = response;
              mourn(current + 1, total + 1).then((response) => {
                console.log("Mourning now,", response);
                this.setState(
                  {
                    currentActives: current + 1,
                    totalUses: total + 1,
                    isMourning: true,
                  },
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
              const { current, total } = response;
              mourn(current - 1, total).then((response) => {
                console.log("No longer mourning,", response);
                this.setState({
                  currentActives: response,
                  totalUses: total,
                  isMourning: false,
                });
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
        duration: 5000,
        easing: Easing.elastic(0.5),
      }),
      timing(breathAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.elastic(0.5),
      }),
      timing(backgroundAnim, {
        toValue: 1,
        duration: 5000,
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
    const { glowAnim, breathAnim, backgroundAnim } = this.state;
    await
      sequence([
        parallel([
          timing(glowAnim, {
            toValue: 0,
            duration: 5000,
            easing: Easing.elastic(1),
          }),
          timing(backgroundAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.elastic(0.5),
          }),
        ]),
        timing(breathAnim, {
          toValue: 0,
          duration: 5000,
          easing: Easing.elastic(1),
        }),
      ]).start(async ({ finished }) => {
        if (finished && this.state.isMourning) { // Do not destructure this state variable
          this.setState({
            currentName: "George Floyd",
            currentLink:
              "https://news.sky.com/story/who-was-george-floyd-the-gentle-giant-who-loved-his-hugs-11997206",
            isMorning: false,
          });
          await this.fetchAndSetCurrent(mourningStep.stopped);
        }
      });
  };

  breathOut = async () => {
    const { glowAnim, breathAnim } = this.state;
    await parallel([
      timing(glowAnim, {
        toValue: 0.75,
        duration: 5000,
        easing: Easing.elastic(0.5),
      }),
      timing(breathAnim, {
        toValue: 0,
        duration: 5000,
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
    const index = Math.floor(Math.random() * lives.length);
    this.setState({
      currentName: lives[index][0],
      currentLink: lives[index][1],
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
      currentLink,
    } = this.state;
    const OpenURLButton = ({ url, text }) => {
      const handlePress = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);

        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
      }, [url]);

      return (
        <TouchableOpacity onPress={handlePress}>
          <Text
            style={{ ...styles.titleText, textDecorationLine: "underline" }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      );
    };
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
          <Text style={styles.titleText}></Text>
          <Text style={styles.numberText}>{currentActives}</Text>
        </Animated.View>
        <Animated.View style={{ ...styles.nameContainer, opacity: breathAnim }}>
          <Text style={styles.titleText}>In loving memory of</Text>
          <OpenURLButton url={currentLink} text={`— ${currentName} —`} />
          {/* <Text style={styles.titleText}>{`— ${currentName} —`}</Text> */}
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
    fontSize: 24,
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
