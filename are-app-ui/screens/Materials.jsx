import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, Dimensions } from 'react-native'
import { Appbar, Button, Divider, TextInput } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";
import { Avatar } from 'react-native-paper'
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Axios from "axios"



const Materials = ({navigation}) => {

    const [materials,setMateirlas ] = useState([])

    const [name,setName] = useState("")
    const [quantity,setQuantity] = useState("1")
    const [photo,setPhoto] = useState("")

    const [target,setTarget] = useState("")

    const [modalAdd, setModalAdd] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [listVisible, setListVisible] = useState(false)
    const [userList,setUserList] = useState([])

    useEffect(()=>{
        fetch("https://are-app-back.herokuapp.com/materials")
        .then(resp => resp.json())
        .then(data => setMateirlas(data))
        .catch(e => console.log(e) )
    },[])

    useEffect(()=>{
        fetch("https://are-app-back.herokuapp.com/materials/userList",{
            headers:{
                "content-type":"application/json"
            },
            method:"post",
            body:JSON.stringify({
                materialId:target
            })
        })
        .then(resp => resp.json())
        .then(data => setUserList(data))
        .catch(e => console.log(e))
    },[target])


    const uploadPhoto = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

        if (permissionResult.granted === false) {
            console.log("Permission to access camera roll is required!");
            return;
        }


        let data = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        })
        if (!data.cancelled) {
            let file = { uri: data.uri, type: `test/${data.uri.split(".")[1]}`, name: `test.${data.uri.split(".")[1]}` }
            uploadFile(file)
        }

        console.log(data);
    }
    const uploadFile = async (file) => {
        let data = new FormData()
        data.append("cloud_name", "dsiequmqm")
        data.append("upload_preset", "areapp")
        data.append("file", file)
        let aa = await Axios.post("https://api.cloudinary.com/v1_1/dsiequmqm/image/upload", data)
        setPhoto(aa.data.url)
        
    }

    const uploadMat = ()=>{
        fetch("https://are-app-back.herokuapp.com/materials",{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                // totaleQuantity:quantity,
                quantity:parseInt(quantity),
                photo:photo
            })
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setModalAdd(false)
        })
        .catch(e => console.log(e))
    }

    const deleteMat = ()=>{
        fetch("https://are-app-back.herokuapp.com/materials/delete/"+target,{
            method:"delete",
            headers:{
                "content-type":"application/json"
            }
        })
        .then(resp=> resp.json())
        .then(data => console.log(data))
        .catch(e => console.log(e))
    }

    const editMat = ()=>{
        fetch("https://are-app-back.herokuapp.com/materials/update",{
            method:"PATCH",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                id:target,
                name:name,
                quantity:quantity,
                photo:photo
            })
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setModalEdit(false)
            alert("done")
        })
        .catch(e => console.log(e))
    }

    return (
        <LinearGradient
            colors={["rgba(0, 0, 0, 1)", "rgba(226, 172, 13, 0.9)"]}
        >
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title="Matrial table" />
                {/* <Appbar.Action icon="magnify" onPress={() => { console.log("pressed") }} /> */}
            </Appbar.Header>
            <Button style={styles.btn} mode="contained" onPress={() => {setName("");setQuantity("");setModalAdd(true)}}>
                New Material
            </Button>

            <View style={styles.container}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "50%" }}>Name</Text>
                    <Text style={{ width: "15%" }}>Total</Text>
                    <Text style={{ width: "20%" }}>Current</Text>
                    <Text>Actions</Text>
                </View>
                <Divider style={{ height: 1, backgroundColor: "black" }} />
                <ScrollView style={{ height: Dimensions.get("screen").height / 1.5 }}>
                    {materials.map((data,i) => {
                        return (
                            <View key={i}>
                                <View style={styles.line}>
                                    <TouchableOpacity onPress={()=> {setListVisible(true);setTarget(data._id)}}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >
                                        <Avatar.Image size={60} source={{uri:data.photo}}  />
                                        <Text style={{ paddingLeft: 2 }}>{data.name} </Text>
                                    </View>
                                    </TouchableOpacity>
                                    <Text>{data.totalQuantity}</Text>
                                    <Text>{data.currentQuantity} </Text>
                                    <View style={{ display: "flex", flexDirection: "row" }} >
                                        <TouchableOpacity onPress={()=>{setName(data.name);setTarget(data._id);setQuantity(data.totalQuantity+"");setPhoto(data.photo);setModalEdit(true)}}>
                                        <Entypo name="edit" size={24} color="black" style={{ paddingRight: 15 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=> {setModalDelete(true);setTarget(data._id)}}>
                                        <Entypo name="trash" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>

            </View>
            <Modal visible={modalAdd} animationType="slide" transparent={true}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>New Material</Text>
                    <TextInput
                        label="Material Name"
                        value={name}
                        onChangeText={text => setName(text)}
                        style={{ backgroundColor: "transparent" }}
                    />
                    <TextInput
                        label="Material Quantity"
                        value={quantity}
                        keyboardType="number-pad"
                        onChangeText={text => setQuantity(text)}
                        style={{ backgroundColor: "transparent" }}
                    />

                    <Button style={{ marginTop: 30 }} mode="contained" onPress={e => uploadPhoto()}>Upload Photo</Button>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" onPress={uploadMat}>ADD</Button>
                        <Button mode="text" onPress={() => setModalAdd(false)}>Close</Button>
                    </View>
                </View>
            </Modal>
            <Modal visible={modalEdit} animationType="slide" transparent={true}>
                <View style={{...styles.modalView}}>
                    <Text style={styles.modalTitle}>Edit Material</Text>
                    <TextInput
                        label="Material Name"
                        value={name}
                        onChangeText={text => setName(text)}
                        style={{ backgroundColor: "transparent" }}
                    />
                    <TextInput
                        label="Material Quantity"
                        value={quantity}
                        onChangeText={text => setQuantity(text)}
                        style={{ backgroundColor: "transparent" }}
                    />

                    <Button style={{ marginTop: 30 }} onPress={e => uploadPhoto()} mode="contained">Upload Photo</Button>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" onPress={editMat}>SAVE</Button>
                        <Button mode="text" onPress={() => setModalEdit(false)}>Close</Button>
                    </View>
                </View>
            </Modal>
            <Modal visible={modalDelete} animationType="slide" transparent={true}>
                <View style={{...styles.modalView,marginTop:'40%'}}>
                    <Text style={styles.modalTitle} >Delete an item</Text>
                    <Text>Are you sure you want to delete this item ?</Text>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" onPress={deleteMat}>Yes</Button>
                        <Button mode="text" onPress={() => setModalDelete(false)}>No</Button>
                    </View>
                </View>
            </Modal>
            <Modal visible={listVisible} animationType="slide" transparent={true}>
                <View style={{...styles.modalView,marginTop:'40%'}}>
                    <Text style={styles.modalTitle}>Users List</Text>
                    <View>
                        {userList.map((data,i)=>(
                            <Text key={i}>* {data.user.username} </Text>
                        ))}

                    </View>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" onPress={() => setListVisible(false)}>OK</Button>
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
        marginTop: 50,
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
