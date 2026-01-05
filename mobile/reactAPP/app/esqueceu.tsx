import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Input } from '../components/input';
import { router } from 'expo-router';
import { useState } from "react";

export default function Entre() {
    const [email,setEmail] = useState('')
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/images/logoColor.png')} />
            <Text style={styles.title}>Recuperação de senha</Text>
            <Text style={{textAlign: "center"}}>Insira seu email para receber as instruções de recuperação de senha.</Text>
            <Input placeholder="Email:" valueChange={(txt) => {
                setEmail(txt)
                
                }} value={email}/>
            <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => router.navigate('/entre')}>
                <Text style={styles.buttonText}>Enviar link de recuperação</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 36,
        paddingTop:120,
        gap:10,
    },
    image: {
        width: 130,
        height: 130,
        marginBottom: 20,
    },
    title: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30,
        fontFamily: 'Roboto_700Bold',
        marginBottom: 20,
    },
    esquece: {
        width: '100%',
        marginBottom: 20,
    },
    esqueceText: {
        textAlign: 'right',
        fontSize: 16,
        fontFamily: 'Roboto_400Regular',
        textDecorationLine: 'underline',
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: '#805BEF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto_500Medium',
    },
    text:{
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',
        marginTop: 10,
    },
    cadastre:{
        flexDirection: 'row',
        gap: 5,
        marginTop: 10,
        alignItems: 'center',
    },
});