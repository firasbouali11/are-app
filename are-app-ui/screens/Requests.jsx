import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import { Appbar, Avatar, Divider, Button } from 'react-native-paper'
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';



const Requests = ({ navigation }) => {

    const [requests,setRequests] = useState([])
    const [target,setTarget] = useState(null)

    const [modalDetail, setModalDetail] = useState(false)

    useEffect(()=>{
        fetch("https://are-app-back.herokuapp.com/users/requests")
        .then(resp => resp.json())
        .then(data => setRequests(data))
        .catch(e => console.log(e))
    },[])

    const accept = ()=>{
        fetch("https://are-app-back.herokuapp.com/users/itemAccept/"+target._id,{
            headers:{
                "content-type":"application/json",
            },
            method:"PATCH"
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setModalDetail(false)
        })
        .catch(e => console.log(e))
    }
    const refuse = ()=>{
        fetch("https://are-app-back.herokuapp.com/users/itemRefuse/"+target._id,{
            headers:{
                "content-type":"application/json",
            },
            method:"PATCH"
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setModalDetail(false)
        })
        .catch(e => console.log(e))
    }
    return (

        <LinearGradient
            colors={["rgba(0, 0, 0, 1)", "rgba(226, 172, 13, 0.9)"]}
            style={styles.container}
        >
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title="Material Requests" />
                {/* <Appbar.Action icon="magnify" onPress={() => { console.log("pressed") }} /> */}
            </Appbar.Header>

            <Divider style={{ height: 1, backgroundColor: "" }} />
            <ScrollView>
                <View style={{ backgroundColor: "#E1DBBD" }}>
                    {requests.map((data,i) => (
                        <TouchableOpacity key={i} onPress={() => { setModalDetail(true);setTarget({...data}) }}>
                            <View style={styles.line}>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <Avatar.Image size={60} source={{uri:data.user.photo}} />
                                    <Text style={{ paddingLeft: 2 }}>{data.user.username} </Text>
                                </View>
                                <View>
                                    <Entypo name="shopping-cart" size={24} color="black" />
                                </View>
                            </View>
                        </TouchableOpacity>

                    ))}
                </View>
            </ScrollView>
            <Modal visible={modalDetail} animationType="slide" transparent={true}>
                <View style={{ ...styles.modalView, marginTop: '40%' }}>
                    <Text style={styles.modalTitle}>Item Request</Text>
                    <View style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                        <Text>{target!= null ? target.material.name : "" } </Text>
                        <Text>{target!= null ? target.quantity: "" }</Text>
                    </View>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" onPress={accept}><Text style={{ color: "green" }}>Accept</Text></Button>
                        <Button mode="text" onPress={refuse}><Text style={{ color: "red" }}>Refuse</Text></Button>
                        <Button mode="text" onPress={() => setModalDetail(false)}><Text style={{ color: "grey" }}>Cancel</Text></Button>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    )
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "white",
    },
    line: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderBottomWidth: 1 },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",

    },
    modalTitle: {
        fontSize: 40
    },
    container:{
        flex:1
    }
})
export default Requests
