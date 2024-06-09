import { NativeBaseProvider } from "native-base";
import React from "react";
import Home from "./scr/pages/Home";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./scr/routes";

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}