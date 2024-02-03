import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, Dimensions, TouchableOpacity } from 'react-native'
import { Appbar, Button, Divider, TextInput } from 'react-native-paper';
import { Avatar } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import Axios from "axios"



const Users = ({ navigation }) => {

    // const materials = [12:2, 545, 465, 48, 79, 9]
    const [modalAdd, setModalAdd] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [listVisible, setListVisible] = useState(false)


    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [classe, setClasse] = useState("")
    const [userPhoto, setUserPhoto] = useState("")


    const [users, setUsers] = useState([])
    const [materials, setMaterials] = useState([])
    const [target, setTarget] = useState("")
    const [targetuser, setTargetuser] = useState({})

    useEffect(() => {
        fetch("https://are-app-back.herokuapp.com/users")
            .then(resp => resp.json())
            .then(data => setUsers(data))
            .catch(e => console.log(e))
    }, [])


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
        setUserPhoto(aa.data.url)

    }

    const addUser = () => {
        fetch("https://are-app-back.herokuapp.com/users", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                classe: classe,
                photo: userPhoto
            })
        })
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
    }

    const deleteuser = () => {
        fetch("https://are-app-back.herokuapp.com/users/" + target, {
            method: 'delete',
            headers: {
                "content-type": "application/json"
            },
        })
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
    }

    const editUser = () => {
        fetch("https://are-app-back.herokuapp.com/users/" + target, {
            headers: {
                "content-type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({
                username: username,
                email: email,
                classe: classe,
                photo: userPhoto
            })
        })
        .then(resp => resp.json())
        .then(data =>{
            console.log(data)
            setModalEdit(false)
            alert("done")
        })
    }

    useEffect(() => {
        fetch("https://are-app-back.herokuapp.com/users/materialsList/" + target)
            .then(resp => resp.json())
            .then(data => { console.log(data); setMaterials(data) })
            .catch(e => console.log(e))
    }, [target])

    return (
        <LinearGradient
            colors={["rgba(0, 0, 0, 1)", "rgba(226, 172, 13, 0.9)"]}
        >
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Users list" />
                {/* <Appbar.Action icon="magnify" onPress={() => { console.log("pressed") }} /> */}
            </Appbar.Header>
            <Button style={styles.btn} mode="contained" onPress={() => {setUsername("");setEmail("");setClasse("");setModalAdd(true)}}>
                Add User
            </Button>

            <View style={styles.container}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "50%" }}>Name</Text>
                    <Text style={{ width: "30%" }}>Material</Text>
                    <Text>Actions</Text>
                </View>
                <Divider style={{ height: 1, backgroundColor: "black" }} />
                <ScrollView style={{ height: Dimensions.get("screen").height / 1.5 }}>
                    {users.map((data, i) => {
                        return (
                            <View key={i}>
                                <View style={styles.line}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <Avatar.Image size={60} source={{uri:data.photo}} />
                                        <Text style={{ paddingLeft: 2 }}>{data.username} </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { setListVisible(true); setTarget(data._id) }}>
                                        <MaterialIcons name="settings-input-component" size={24} color="black" />
                                    </TouchableOpacity>
                                    <View style={{ display: "flex", flexDirection: "row" }}>
                                        <TouchableOpacity onPress={() => { setTarget(data._id); setUsername(data.username); setEmail(data.email); setClasse(data.classe); setUserPhoto(data.photo); setModalEdit(true) }}>
                                            <Entypo name="edit" size={24} color="black" style={{ paddingRight: 15 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { setModalDelete(true); setTarget(data._id) }}>
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
                <View style={{ ...styles.modalView }}>
                    <Text style={styles.modalTitle}>Add new Member</Text>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={text => setUsername(text)}
                        style={{ backgroundColor: "transparent" }}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={{ backgroundColor: "transparent" }}
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={{ backgroundColor: "transparent" }}
                    />
                    <TextInput
                        label="Class"
                        value={classe}
                        onChangeText={text => setClasse(text)}
                        style={{ backgroundColor: "transparent" }}
                    />

                    <Button style={{ marginTop: 30 }} mode="contained" onPress={e => uploadPhoto()}>Upload Photo</Button>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" color="green" onPress={addUser}><Text style={{ color: "green" }} >ADD</Text></Button>
                        <Button mode="text" color="red" onPress={() => setModalAdd(false)}><Text style={{ color: "red" }}>Close</Text></Button>
                    </View>
                </View>
            </Modal>
            <Modal visible={modalEdit} animationType="slide" transparent={true}>
                <View style={{ ...styles.modalView }}>
                    <Text style={styles.modalTitle}>Edit Member</Text>
                    <TextInput
                        label="Username"
                        value={username} clear
                        onChangeText={text => setUsername(text)}
                        style={{ backgroundColor: "transparent" }}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={{ backgroundColor: "transparent" }}
                    />
                    <TextInput
                        label="Classe"
                        value={classe}
                        onChangeText={text => setClasse(text)}
                        style={{ backgroundColor: "transparent" }}
                    />
                    {/* <TextInput
                        label="Password"
                        value={password}
                        onChangeText={text => setUsername(text)}
                        style={{ backgroundColor: "transparent" }}
                    /> */}

                    {/* <Button style={{ marginTop: 30 }} mode="contained">Upload Photo</Button> */}
                    <Button style={{ marginTop: 30 }} mode="contained" onPress={e => uploadPhoto()}>Upload Photo</Button>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" color="green" onPress={editUser}><Text style={{ color: "green" }}>SAVE</Text></Button>
                        <Button mode="text" color="red" onPress={() => setModalEdit(false)}><Text style={{ color: "red" }}>Close</Text></Button>
                    </View>
                </View>
            </Modal>
            <Modal visible={modalDelete} animationType="slide" transparent={true}>
                <View style={{ ...styles.modalView, marginTop: '40%' }}>
                    <Text style={styles.modalTitle}>Delete an item</Text>
                    <Text>Are you sure you want to delete this member ?</Text>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" color="green" onPress={e => { deleteuser(); setModalDelete(false) }}><Text style={{ color: "green" }}>Yes</Text></Button>
                        <Button mode="text" color="red" onPress={() => setModalDelete(false)}><Text style={{ color: "red" }}>No</Text></Button>
                    </View>
                </View>
            </Modal>
            <Modal visible={listVisible} animationType="slide" transparent={true}>
                <View style={{ ...styles.modalView, marginTop: '40%' }}>
                    <Text style={styles.modalTitle}>Material List</Text>
                    <View>
                        {materials.map((data, i) => (
                            <Text key={i}>* {data.material.name} x{data.quantity}</Text>
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
        marginLeft: "2%",
        marginRight: "2%",
        padding: 15,
        backgroundColor: "rgba(226, 172, 13, 0.5)",
        marginTop: 50,
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
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",

    },
    modalTitle: {
        fontSize: 40
    }
})


export default Users
