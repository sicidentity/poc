import React from 'react';
import { Canvas, DiffRect, rect, rrect, Path } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;
const cornerLength = 50;
const cornerWidth = 5;

const Overlay = () => {
  const centerX = width / 2;
  const centerY = height / 2;
  const halfInner = innerDimension / 2;

  const outer = rrect(rect(0, 0, width, height), 0, 0);
  const inner = rrect(
    rect(
      centerX - halfInner,
      centerY - halfInner,
      innerDimension,
      innerDimension
    ),
    50,
    50
  );

  const topLeft = {
    x: centerX - halfInner,
    y: centerY - halfInner
  };
  const topRight = {
    x: centerX + halfInner,
    y: centerY - halfInner
  };
  const bottomLeft = {
    x: centerX - halfInner,
    y: centerY + halfInner
  };
  const bottomRight = {
    x: centerX + halfInner,
    y: centerY + halfInner
  };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Canvas
        style={
          Platform.OS === "android" 
            ? { flex: 1 } 
            : StyleSheet.absoluteFillObject
        }
      >
        <DiffRect 
          inner={inner} 
          outer={outer} 
          color="black" 
          opacity={0.5} 
        />

        <Path 
          path={`M ${topLeft.x} ${topLeft.y} h ${cornerLength} v ${cornerWidth}`}
          color="white"
        />
        <Path 
          path={`M ${topLeft.x} ${topLeft.y} v ${cornerLength} h ${cornerWidth}`}
          color="white"
        />

        <Path 
          path={`M ${topRight.x} ${topRight.y} h -${cornerLength} v ${cornerWidth}`}
          color="white"
        />
        <Path 
          path={`M ${topRight.x} ${topRight.y} v ${cornerLength} h -${cornerWidth}`}
          color="white"
        />

        <Path 
          path={`M ${bottomLeft.x} ${bottomLeft.y} h ${cornerLength} v -${cornerWidth}`}
          color="white"
        />
        <Path 
          path={`M ${bottomLeft.x} ${bottomLeft.y} v -${cornerLength} h ${cornerWidth}`}
          color="white"
        />

        <Path 
          path={`M ${bottomRight.x} ${bottomRight.y} h -${cornerLength} v -${cornerWidth}`}
          color="white"
        />
        <Path 
          path={`M ${bottomRight.x} ${bottomRight.y} v -${cornerLength} h -${cornerWidth}`}
          color="white"
        />
      </Canvas>
    </View>
  );
};

export default Overlay;