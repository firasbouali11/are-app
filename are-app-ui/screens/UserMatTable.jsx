import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, Dimensions, AsyncStorage } from 'react-native'
import { Appbar, Button, Divider, TextInput } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";
import { Avatar } from 'react-native-paper'
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Fontisto } from '@expo/vector-icons';



const Materials = ({navigation}) => {
    
    const [materials,setMaterials] = useState([])
    const [target, setTarget] = useState("")

    const [modalReturn, setModalReturn] = useState(false)

    useEffect(()=>{
        const  aa = async ()=>{
            let user = await AsyncStorage.getItem("id")
            console.log(user)
            fetch("https://are-app-back.herokuapp.com/users/materialsList/"+user)
            .then(resp => resp.json())
            .then(data => setMaterials(data))
            .catch(e => console.log(e))
        }
        aa()
        
    },[])

    const returnItem = ()=>{
        fetch("https://are-app-back.herokuapp.com/users/returnItem/"+target,{
            method:"PATCH",
            headers:{
                "content-type":"application/json"
            },
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setModalReturn(false)
        })
        .catch(e => console.log(e))
    }
    return (
        <LinearGradient
            colors={["rgba(0, 0, 0, 1)", "rgba(226, 172, 13, 0.9)"]}
            style={{flex:1}}
        >
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title="Matrial table" />
                {/* <Appbar.Action icon="magnify" onPress={() => { console.log("pressed") }} /> */}
            </Appbar.Header>

            <View style={styles.container}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "50%" }}>Name</Text>
                    <Text style={{ width: "20%" }}>Quantity</Text>
                    <Text style={{ width: "20%" }}>Status</Text>
                    <Text srtle={{textAlign:"start"}}>Actions</Text>
                </View>
                <Divider style={{ height: 1, backgroundColor: "black" }} />
                <ScrollView style={{ height: Dimensions.get("screen").height / 1.5 }}>
                    {materials.map((data,i) => {
                        return (
                            <View key={i}>
                                <View style={styles.line}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >
                                        <Avatar.Image size={60} source={{uri:data.material.photo}}  />
                                        <Text style={{ paddingLeft: 2 }}>{data.material.name}</Text>
                                    </View>
                                    <Text>{data.quantity} </Text>
                                    <Text>{data.status} </Text>
                                    <View style={{ display: "flex", flexDirection: "row" }} >
                                        <TouchableOpacity disabled={data.returned} onPress={()=>{setModalReturn(true);setTarget(data._id)}} style={{marginRight:10}}>
                                            <Fontisto name="arrow-return-right" size={24} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>

            </View>
            <Modal visible={modalReturn} animationType="slide" transparent={true}>
                <View style={{...styles.modalView,marginTop:'40%'}}>
                    <Text style={styles.modalTitle} >Return an item</Text>
                    <Text>Are you sure you want to return this item ?</Text>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" color="green" onPress={returnItem}><Text style={{color:"green"}}>Yes</Text></Button>
                        <Button mode="text" color="red" onPress={() => setModalReturn(false)}><Text style={{color:"red"}}>No</Text></Button>
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
    container: {
        backgroundColor: "#E1DBBD",
        marginTop: 100,
        marginEnd: "2%",
        marginStart: "2%"
    },
    btn: {
        marginLeft: "5%",
        marginRight: "5%",
        padding: 15,
        backgroundColor: "rgba(226, 172, 13, 0.5)",
        marginTop: 50,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",

    },
    line: {
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 10
    },
    modalTitle:{
        fontSize:40
    }
})


export default Materials
