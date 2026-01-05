import {  View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { Input } from '@/components/input';
import { router } from 'expo-router';
import { Usuario } from "@/objects/usuario";
import { useDatabase } from "@/database/useDatabase";

export default function Entre() {
    const db = useDatabase()
    
    let email: string = "", senha: string = "";
    function entrar(Email: string, Senha: string) {
        if (Email === "" || Senha === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        if(Email.indexOf("@") === -1 || Email.indexOf(".") === -1) {
            alert("Por favor, insira um email válido.");    
            return;
        }
        const usuario = new Usuario( Email, Senha);
        const logou = usuario.login()
        logou.then((res) => {
            if(res == 400){
                alert("Dados incompletos.");
                return;
            }
            if(res == 404){
                alert("Email ou senha incorretos.");
                return;
            }
            if(res == 500){
                alert("Erro no servidor. Tente novamente mais tarde.");
                return;
            }
            db.create(usuario)
            alert("Login realizado com sucesso! Bem-vindo(a) " + usuario.nome);
            router.replace("/home")
            return;
        });
        
       
    }
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/images/logoColor.png')} />
            <Text style={styles.title}>Login</Text>
            <Input placeholder="Email:" valueChange={(text)=>{
                email = text
            }} value={email}/>
            <Input placeholder="Senha:" secureTextEntry valueChange={(text)=>{
                senha = text
            }} value={senha}/>
            <TouchableOpacity style={styles.esquece} activeOpacity={0.9} onPress={() => router.navigate('/esqueceu')}>
                <Text style={styles.esqueceText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => entrar(email, senha)}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <Text style={styles.text}>ou</Text>
            <View style={styles.outros}>
                <TouchableOpacity style={styles.imgeButton} activeOpacity={0.9} onPress={() => {}}>
                    <Image style={styles.img} source={require('../assets/images/google.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.imgeButton} activeOpacity={0.9} onPress={() => {}}>
                    <Image style={styles.img} source={require('../assets/images/facebok.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.imgeButton} activeOpacity={0.9} onPress={() => {}}>
                    <Image style={styles.img} source={require('../assets/images/outlok.png')} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cadastre} activeOpacity={0.9} onPress={() => router.navigate('/cadastro')}>
                <Text style={styles.text}>Ainda não tem conta</Text>
                <Text style={[styles.text, { textDecorationLine: 'underline', fontWeight: 'bold' }]}>Cadastre-se</Text>
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
    },
    text:{
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',
        marginTop: 10,
    },
    cadastre:{
        gap: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    imgeButton:{
        marginTop: 10,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    img:{
        width: 50,
        height: 50,
    },
    outros:{
        flexDirection: 'row',
        gap: 30,
        marginTop: 10,
    }
});