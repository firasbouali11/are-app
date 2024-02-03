import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, ScrollView, Dimensions, Text, AsyncStorage } from 'react-native'
import { TextInput, Button, Modal } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";




const Singin = ({ navigation }) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [modalVisible, setModalVisible] = useState(false)


    const login = () => {
        if(username === "admin"){
            fetch("https://are-app-back.herokuapp.com/signin/admin",{
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            })
            .then(resp => resp.json())
            .then(data => {
                if(data.error){
                    console.log(data)
                    return setModalVisible(true);
                }
                // AsyncStorage.setItem("admin",data.admin)
                AsyncStorage.setItem("username",data.username)
                setUsername("")
                setPassword("")
                navigation.navigate("home")
            })
            .catch(e => console.log(e))

        }else{
            fetch("https://are-app-back.herokuapp.com/signin/user",{
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            })
            .then(resp => resp.json())
            .then(data => {
                if(data.error){
                    console.log(data)
                    return setModalVisible(true);
                }
                AsyncStorage.setItem("token",data.token)
                AsyncStorage.setItem("id",data.id)
                navigation.navigate("user")
            })
            .catch(e => console.log(e))

        }
        // if (username.toLowerCase() === "admin" && password.toLowerCase() === "admin") {
        //     navigation.push("home")
        // } else if (username.toLowerCase() === "user" && password.toLowerCase() === "user") {
        //     navigation.navigate("user")
        // }
        // else {
        //     console.log("error")
        //     setModalVisible(true);
        // }
    }
    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={["rgba(0, 0, 0, 1)", "rgba(226, 172, 13, 0.9)"]}
                style={styles.container}
            >
                <View style={{ height: 350, width: "100%" }}>
                    <Image
                        style={styles.logo}
                        source={require("../assets/logo-are.png")}
                    />
                </View>
                <TextInput
                    label="User id"
                    value={username}
                    onChangeText={text => setUsername(text)}
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    type="password"
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry={true}
                />

                <Button style={styles.btn} mode="contained" onPress={() => { login() }}>
                    Sing In
                </Button>
                <Button style={styles.btn} mode="contained" onPress={() => navigation.navigate("qrcode")}>
                    QR Code
                </Button>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.modalView}>
                        <Text>User id or Password is incorrect. Please try again or contact an admin for more details.</Text>
                        <Button style={{marginTop:30}} mode="contained" onPress={() => setModalVisible(false)}>close</Button>
                    </View>
                </Modal>
            </LinearGradient>
        </ScrollView>

    )
}


const styles = StyleSheet.create({
    input: {
        margin: 20,
        backgroundColor: "#E1DBBD",
        borderRadius: 10
    },
    btn: {
        marginLeft: "30%",
        marginRight: "30%",
        backgroundColor: "rgba(226, 172, 13, 0.5)",
        marginTop: 20,
    },
    logo: {
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
        height: Dimensions.get("window").height
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
    }

});


export default Singin
