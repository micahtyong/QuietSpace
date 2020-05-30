import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>About</Text>
    </View>
  );
}

AboutScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
});
