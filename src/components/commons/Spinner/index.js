import React, { useRef, useMemo } from "react";
import { StyleSheet, View, Animated } from "react-native";

const Spinner = ({ children, size, style }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  Animated.loop(
    Animated.timing(rotation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    })
  ).start();

  const spinerStyle = useMemo(
    () => ({
      ...styles.spinner,
      width: size ? (size[0] ? size[0] : "auto") : "auto",
      height: size ? (size[1] ? size[1] : "auto") : "auto",
    }),
    [size]
  );

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[spinerStyle, { transform: [{ rotate: rotateInterpolate }] }]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  spinner: {
    backgroundColor: "transparent",
  },
});

export default Spinner;
