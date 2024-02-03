import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image, AsyncStorage,ScrollView } from 'react-native'
import { Button, Menu,Provider } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";
import Constants from 'expo-constants';





const Home = ({ navigation }) => {
    const logout = ()=>{
        AsyncStorage.clear()
        navigation.goBack()
    }
    return (
        <LinearGradient
            colors={["rgba(0, 0, 0, 1)", "rgba(226, 172, 13,6)"]}
            style={styles.container}
        >
            <ScrollView>
            {/* <Text style={{color:"white"}}>Welcome User</Text> */}
            <Image style={{ width: "50%", height: 200, position: "absolute", right: 0, marginTop: 60, zIndex: 100 }} source={require("../assets/robot.png")} />
            <View style={styles.homeBar}>
                <Text style={styles.title}>We are ARE</Text>
                <Text style={styles.title}>We are family</Text>
            </View>
            <Button style={styles.btn} mode="contained" onPress={() => navigation.navigate("users")}>
                Users List
            </Button>
            <Button style={styles.btn} mode="contained" onPress={() => navigation.navigate("materials")}>
                Material Table
            </Button>
            <Button style={styles.btn} mode="contained" onPress={() => navigation.navigate("requests")}>
                Material Requests
            </Button>
            <Button style={styles.btn} mode="contained" onPress={() => navigation.navigate("return")}>
                Return Confirmation
            </Button>
            <Button style={styles.btn} mode="contained" onPress={() => {logout()}}>
                Logout
            </Button>
            </ScrollView>
        </LinearGradient>
    )
}

export const User = ({ navigation }) => {
    const [visible, setVisible] = React.useState(false);
    useEffect(()=>{
        const  aa = async ()=>{
            let user = await AsyncStorage.getItem("token")
            console.log(user)
        }
        aa()
    },[])

    const logout = ()=>{
        AsyncStorage.clear()
        navigation.goBack()
    }
    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);
    return (
        <LinearGradient
            colors={["rgba(0, 0, 0, 1)", "rgba(226, 172, 13, 0.9)"]}
            style={styles.container}
        >
{/* 
            <Provider>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<Button  onPress={openMenu}>Welcome User</Button>}>
                        <Menu.Item onPress={() => { }} title="Logout" />
                    </Menu>
                </View>
            </Provider> */}
            <Image style={{ width: "50%", height: 200, position: "absolute", right: 0, marginTop: 60, zIndex: 100 }} source={require("../assets/robot.png")} />

            <View style={styles.homeBar}>
                <Text style={styles.title}>We are ARE</Text>
                <Text style={styles.title}>We are family</Text>
            </View>
            <Button style={styles.btn} mode="contained" onPress={() => navigation.navigate("ask")}>
                Ask for material
            </Button>
            <Button style={styles.btn} mode="contained" onPress={() => navigation.navigate("user_materials")}>
                Material Table
            </Button>
            <Button style={styles.btn} mode="contained" onPress={() => {logout()}}>
                Logout
            </Button>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    homeBar: {
        height: 100,
        backgroundColor: "white",
        width: "100%",
        marginTop: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",

    },
    title: {
        fontSize: 30,
        paddingLeft: 30,
    },
    btn: {
        marginLeft: "20%",
        marginRight: "20%",
        padding: 15,
        backgroundColor: "rgba(226, 172, 13, 0.5)",
        marginTop: 20,
    },
    container: {
        flex: 1
    }
})

export default Home
