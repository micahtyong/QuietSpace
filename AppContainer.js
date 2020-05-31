import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MainScreen from "./screens/MainScreen";
import InfoScreen from "./screens/InfoScreen";

const Stack = createStackNavigator();

export default function AppContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main' headerMode={false}>
        <Stack.Screen name='Main' component={MainScreen} />
        <Stack.Screen name='Info' component={InfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
