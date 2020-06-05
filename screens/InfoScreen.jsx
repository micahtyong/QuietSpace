import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const { Value, timing, sequence, loop } = Animated;
const backButton = require(".././assets/backButton.png");

const information = [
  {
    section: "1",
    type: "text",
    title: "Why We Made Ember",
    body: [
      {
        paragraph: "1",
        description:
          "We are grieving after George Floyds death, but there aren't many avenues for us to honor his life and show solidarity with one another. There’s social media, but sometimes it can feel overwhelming and really graphic with many hard-to-watch videos circulating, we’re just not sure if that’s the best way to honor someone’s life.",
      },
      {
        paragraph: "2",
        description:
          "We created Ember in response to this. It hopes to provide something a little less cluttered, and a little more focused on who we’ve lost.",
      },
    ],
  },
  {
    section: "2",
    type: "text",
    title: "How It Works",
    body: [
      {
        paragraph: "1",
        description: "1.) Press to light your ember.",
      },
      {
        description:
          "2.) The number shows how many others are holding onto the light and standing in solidarity with you.",
      },
    ],
  },
  {
    section: "3",
    type: "url",
    title: "How You Can Help",
    body: [
      {
        paragraph: "1",
        description: "Black Lives Matter Website",
        link: "https://blacklivesmatter.com",
      },
    ],
  },
];

const supportedURL = "https://blacklivesmatter.com";

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
        style={{ ...styles.paragraphText, textDecorationLine: "underline" }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View style={styles.topNavigationContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Main");
            }}
          >
            <Image
              source={backButton}
              style={styles.backButtonImage}
              resizeMode='contain'
            />
          </TouchableOpacity>
          <Text style={styles.screenTitleText}>About Ember</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.textContainer}>
          {information.map((text) => (
            <View
              style={styles.sectionContainer}
              key={"idSection" + text.section}
            >
              <Text style={styles.headText}>{text.title}</Text>
              {text.body.map((paragraph) => (
                <View key={"idParagraphSection" + paragraph.paragraph}>
                  {text.type === "url" ? (
                    <OpenURLButton
                      url={supportedURL}
                      text={paragraph.description}
                    />
                  ) : (
                      <Text style={styles.paragraphText}>
                        {paragraph.description}
                      </Text>
                    )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  topNavigationContainer: {
    flexDirection: "row",
    width: wp(100),
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(7.5),
    paddingHorizontal: wp(7.5),
  },
  backButtonImage: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray",
    borderRadius: 100,
    width: 35,
    height: 35,
    opacity: 0.5,
  },
  screenTitleText: {
    alignSelf: "center",
    color: "#CCCCCC",
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: "Lora",
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
    color: "#CCCCCC",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 16,
    fontFamily: "Lora",
  },
  paragraphContainer: {
    marginBottom: hp(2),
    width: "100%",
    paddingHorizontal: wp(5),
  },
  paragraphText: {
    width: "100%",
    fontSize: 16,
    color: "#CCCCCC",
    marginBottom: 16,
    paddingHorizontal: wp(5),
    textAlign: "justify",
    fontFamily: "Lora",
  },
});
