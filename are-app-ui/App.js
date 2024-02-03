import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Singin from "./screens/Singin";
import { LinearGradient } from "expo-linear-gradient";
import Home from "./screens/Home";
import Materials from "./screens/Materials";
import Requests from "./screens/Requests";
import Users from "./screens/Users";
import { User } from "./screens/Home";
import Ask from "./screens/Ask";
import Return from "./screens/Return";
import UserMatTable from "./screens/UserMatTable";
import QRCode from "./screens/QRCode";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
   
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="signin" component={Singin} />
          <Stack.Screen name="home" component={Home} />
          <Stack.Screen name="materials" component={Materials} />
          <Stack.Screen name="requests" component={Requests} />
          <Stack.Screen name="return" component={Return} />
          <Stack.Screen name="users" component={Users} />
          <Stack.Screen name="user" component={User} />
          <Stack.Screen name="user_materials" component={UserMatTable} />
          <Stack.Screen name="ask" component={Ask} />
          <Stack.Screen name="qrcode" component={QRCode} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
