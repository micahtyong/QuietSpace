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
  ScrollView,
  Linking,
} from "react-native";
import { fetchCurrent, mourn } from ".././utils/Airtable";
import { mourningStep } from ".././utils/Enumerations";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const { Value, timing, sequence, loop } = Animated;
const backButton = require('.././assets/backButton.png');

const information = [
  {
    section: '1',
    title: 'Why We Made Ember',
    body: [
      {
        paragraph: '1',
        description: "We are grieving after George Floyds death, but there aren't many avenues for us to honor his life and show solidarity with one another. There’s social media, but sometimes it can feel overwhelming and really graphic with many hard-to-watch videos circulating, we’re just not sure if that’s the best way to honor someone’s life."
      },
      {
        paragraph: '2',
        description: "We created Ember in response to this. It hopes to provide something a little less cluttered, and a little more focused on what or who we’ve lost."
      }
    ]
  },
  {
    section: '2',
    title: 'How It Works',
    body: [
      {
        paragraph: '1',
        description: '1.) Press to light your ember.'
      },
      {
        description: '2.) The number shows how many others are holding onto the light and standing in solidarity with you.'
      }
    ]
  },
  {
    section: '3',
    title: 'How You Can Help',
    body: [
      {
        paragraph: '1',
        description: 'Black Lives Matter Website: ',
        link: 'https://blacklivesmatter.com',
      },
    ]
  }
]

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

  render() {
    const { navigation } = this.props;
    const { glowAnim, currentActives } = this.state;
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start' }}>
        <View style={styles.topNavigationContainer}>
          <TouchableOpacity onPress={() => { navigation.navigate('Main') }}>
            <Image source={backButton} style={styles.backButtonImage} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.screenTitleText}>About Ember</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.textContainer}>
          {information.map((text) => (
            <View style={styles.sectionContainer} key={"idSection" + text.section}>
              <Text style={styles.headText}>{text.title}</Text>
              {text.body.map((paragraph) => (
                <View key={"idParagraphSection" + paragraph.paragraph}>
                  <Text style={styles.paragraphText}>{paragraph.description}</Text>
                </View>
              ))}
            </View>
          )
          )}
        </View>
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
  },
  topNavigationContainer: {
    flexDirection: 'row',
    width: wp(100),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(7.5),
    paddingHorizontal: wp(7.5),
  },
  backButtonImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 100,
    width: 35,
    height: 35,
    opacity: 0.5,
  },
  screenTitleText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  textContainer: {
    width: wp(100),
    paddingHorizontal: wp(5),
    marginTop: hp(5),
  },
  sectionContainer: {
    marginVertical: hp(1),
  },
  headText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 16,
  },
  paragraphContainer: {
    marginBottom: hp(2),
    width: '100%',
    paddingHorizontal: wp(5),
  },
  paragraphText: {
    width: '100%',
    fontSize: 16,
    color: 'white',
    marginBottom: 16,
    paddingHorizontal: wp(5),
    textAlign: 'justify',
  }
});
