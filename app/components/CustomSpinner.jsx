import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function DotSpinner({ color }) {
  const dotAnimations = useRef(
    [0, 0, 0].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = dotAnimations.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            delay: index * 200, // Staggered effect for each dot
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((anim) => anim.start());
    return () => animations.forEach((anim) => anim.stop());
  }, [dotAnimations]);

  return (
    <View style={styles.container}>
      {dotAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              // backgroundColor: `{${color}? ${color}:"#2ff3e0"}`,
              backgroundColor: color ? color : "#2ff3e0",
              opacity: anim,
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.5],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  dot: {
    height: 15,
    width: 15,
    marginHorizontal: 5,
    borderRadius: 7.5,
  },
});
