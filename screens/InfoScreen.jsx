import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Button,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const closeButton = require(".././assets/closeButton.png");

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
        style={{
          ...styles.paragraphText,
          textDecorationLine: "underline",
          textAlign: "left",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default class MainScreen extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View style={styles.topNavigationContainer}>
          <View style={{ width: 50 }} />
          <Text style={styles.screenTitleText}>About Ember</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Main");
            }}
          >
            <Image
              source={closeButton}
              style={styles.backButtonImage}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.headText}>Why We Made Ember</Text>
            <Text style={styles.paragraphText}>
              On May 25th, 2020, George Floyd was killed by a police officer in
              Minneapolis, Minnesota, causing millions of people to grieve over
              this injustice. At some point in the process of grieving comes a
              time for reflection and solace necessary for leading change. Ember
              hopes to provide such a space in these dire times.
            </Text>
            <Text style={styles.paragraphText}>
              Say their names. George Floyd's death was unfortunately not the
              only instance of police brutality and manifestation of systemic
              racism: Breonna Taylor. Ahmaud Arbery. Stephon Clark. Alton
              Sterling. Terence Crutcher. Philandro Castile. Antonio Martin.
              Walter Scott. Christian Taylor. Michael Brown. Trayvon Martin.
              Dontre Hamilton. Eric Garner. John Crawford III. Samuel Dubose.
              Sandra Bland. Ezell Ford. Dante Parker. Tanisha Anderson. Akai
              Gurley. Tamir Rice. Rumain Brisbon. Laquan McDonald. Jermaine
              Reed. Tony Robinson. Phillip White. And countless others. Don't
              let their deaths go in vain.
            </Text>
            <Text style={styles.paragraphText}>
              We created Ember in response to this. It hopes to provide
              something a little less cluttered, and a little more focused on
              who we’ve lost due to a system that fails us.
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.headText}>How It Works</Text>
            <Text style={styles.paragraphText}>
              1) Hold the light to ignite your ember.
            </Text>
            <Text style={styles.paragraphText}>
              2) The number indicates how many others are remembering with you.
            </Text>
            <Text style={styles.paragraphText}>
              3) The name indicates one of the many we've lost. Click on their
              name to learn more about their life.
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.headText}>
              Prompts for Reflection and Change
            </Text>
            <Text style={styles.paragraphText}>
              In what ways have I engaged in rhetoric that promotes othering or
              stereotyping of Black people?
            </Text>
            <Text style={styles.paragraphText}>
              What can I do to better educate myself on the historical context
              of race in the country and community I exist in?
            </Text>
            <Text style={styles.paragraphText}>
              How do I feel when I consider my own internal racism and biases?
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.headText}>How You Can Help</Text>
            <OpenURLButton
              url={"https://blacklivesmatter.com"}
              text={"Black Lives Matter website"}
            />
            <OpenURLButton
              url={"https://youtu.be/bCgLa25fDHM"}
              text={"Youtube stream to generate funds through ad revenues"}
            />
            <OpenURLButton
              url={"https://blacklivesmatters.carrd.co/"}
              text={
                "Compilation of petitions, donations, and protesting resources"
              }
            />
          </View>
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
    paddingHorizontal: wp(6),
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
    fontFamily: "Lora",
  },
});
