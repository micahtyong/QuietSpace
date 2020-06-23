import PropTypes from 'prop-types';
import React from "react";
import { StyleSheet, Animated } from 'react-native';

const glow = require("./assets/glow.png");

export default function SmallEmber({ position, opacity }) {
  return (
    <Animated.Image
      source={glow}
      style={{ ...styles.starOne, opacity, left: position.x, bottom: position.y }}
    />
  )

}

SmallEmber.propTypes = {
  position: PropTypes.object.required,
  opacity: PropTypes.number.required,
};

const styles = StyleSheet.create({
  starOne: {
    position: 'absolute',
    width: 25,
    height: 25,
  }
})