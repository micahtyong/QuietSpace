import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

<<<<<<< HEAD
import MainScreen from "./screens/MainScreen";
import AboutScreen from "./screens/AboutScreen";
=======
import MainScreen from './screens/MainScreen';
import InfoScreen from './screens/InfoScreen';
>>>>>>> 94501779ccaf0c82a6ab5b09c01ac35e878fb903

const Stack = createStackNavigator();

export default function AppContainer() {
  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Stack.Navigator initialRouteName='Main' headerMode={false}>
        <Stack.Screen name='Main' component={MainScreen} />
        <Stack.Screen name='About' component={AboutScreen} />
=======
      <Stack.Navigator initialRouteName="Main" headerMode={false}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
>>>>>>> 94501779ccaf0c82a6ab5b09c01ac35e878fb903
      </Stack.Navigator>
    </NavigationContainer>
  );
}
