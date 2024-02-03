import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Picker, Modal, AsyncStorage } from 'react-native'
import { Appbar } from 'react-native-paper'
import { Avatar, Button, Card, Title, Paragraph, TextInput } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";



const Ask = ({ navigation }) => {

    const [selectedValue, setSelectedValue] = useState("")
    const [qty, setQty] = useState("")
    const [materials, setMaterials] = useState([])
    // const [target,setTarget] = useState("")
    const [targetqty, setTargetqty] = useState("")
    const [userid, setUserid] = useState("")


    const [modalAsk, setModalAsk] = useState(false)

    useEffect(() => {
        const aa = async () => {
            let user = await AsyncStorage.getItem("id")
            console.log(user)
            setUserid(user)
        }
        aa()
    }, [])

    useEffect(() => {
        fetch("https://are-app-back.herokuapp.com/materials")
            .then(resp => resp.json())
            .then(data => { console.log(data); setMaterials(data) })
            .catch(e => console.log(e))
    }, [])

    const buy = () => {
        fetch("https://are-app-back.herokuapp.com/users/buyMaterial", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                material: selectedValue,
                user: userid,
                quantity: qty,
            })
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setModalAsk(false)
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
                <Appbar.Content title="Ask for material" />
            </Appbar.Header>

            <Card style={{ backgroundColor: "#E1DBBD", marginTop: "30%", marginLeft: "3%", marginRight: "3%" }}>
                <Card.Content>
                    <Text>Select your item</Text>
                    <Picker
                        selectedValue={selectedValue}
                        style={{ height: 50, width: "100%", backgroundColor: "white" }}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        {materials.map((mat, i) => (
                            <Picker.Item key={i} label={mat.name} value={mat._id} />

                        ))}
                    </Picker>

                    <Text style={{ marginTop: 50 }}>Quantity of the item</Text>
                    <TextInput
                        value={qty}
                        type="number"
                        onChangeText={text => setQty(text)}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                    <Button mode="contained" onPress={() => setModalAsk(true)} style={{ backgroundColor: "#E2AC0D", marginTop: 50 }}>
                        Order
                    </Button>
                </Card.Content>
            </Card>
            <Modal visible={modalAsk} animationType="slide" transparent={true}>
                <View style={{ ...styles.modalView, marginTop: '40%' }}>
                    <Text style={styles.modalTitle}>Demande the item</Text>
                    <Text>Are you sure you want to demande this item ?</Text>
                    <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginTop: 30 }}>
                        <Button mode="text" color="green" onPress={buy}><Text style={{ color: "green" }}>Yes</Text></Button>
                        <Button mode="text" color="red" onPress={() => setModalAsk(false)}><Text style={{ color: "red" }}>No</Text></Button>
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
    input: {
        backgroundColor: "white",
        height: 50
    },
    container: {
        flex: 1
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",

    },
    modalTitle: {
        fontSize: 30
    }
})

export default Ask
