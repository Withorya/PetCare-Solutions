import {  View, TouchableOpacity, Text, Image, StyleSheet, Pressable,} from "react-native";
import { Input } from '@/components/input';
import { router } from 'expo-router';
import { Usuario } from "@/objects/usuario";
import { useDatabase } from "@/database/useDatabase";
import { DatePica } from "@/components/datepicker";




export default function Cadastro() {
    let name: string = "", email: string = "", senha: string = "", confirmaSenha: string = "", data_nascimento: string = "";
    const db = useDatabase()
    function Cadastrar(Name: string, Email: string, Senha: string, ConfirmaSenha: string, Data_nascimento: string) {
   
        if (Name === "" || Email === "" || Senha === "" || ConfirmaSenha === "" || Data_nascimento === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }


        if (Senha.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (Email.indexOf("@") === -1 || Email.indexOf(".") === -1) {
            alert("Por favor, insira um email válido.");    
            return;
        }

        
        if (Senha !== ConfirmaSenha) {
            alert("As senhas não coincidem!");
            return;
        }
        const usuario = new Usuario(Email, Senha, Name, new Date(Data_nascimento));
        const resposta = usuario.register()
        resposta.then((res) => {
            if (res == 400) {
                alert("Dados incompletos.");
                return;
            }
            if (res == 409) {
                alert("Email já cadastrado.");
                return;
            }
            if (res == 500) {
                alert("Erro no servidor. Tente novamente mais tarde.");
                return;
            }
            db.create(usuario)
            alert("Cadastro realizado com sucesso!");
            router.replace('/home');
            return;
        });       
        
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/images/logoColor.png")} />
            <Text style={styles.title}>Cadastro</Text>
            <Input placeholder="Nome" valueChange={(txt) =>{
                name = txt
                
                }} value={name}/>
            <Input autoCapitalize="none" keyboardType="email-address" placeholder="Email" valueChange={(txt) => {
                email = txt
                
                }} value={email}/>
            <Input autoCapitalize="none" placeholder="Senha" valueChange={(txt) =>{
                senha = txt
                
                }} secureTextEntry value={senha}/>
            <Input autoCapitalize="none" placeholder="Confirme a senha" valueChange={(txt) =>{
                confirmaSenha = txt
                
                }} secureTextEntry value={confirmaSenha}/>

          

            <DatePica title="Data de Nascimento" valueButton={(txt)=>{
                data_nascimento=txt?.toLocaleDateString()||''
            }}></DatePica>
          
            <TouchableOpacity style={styles.button} activeOpacity={0.9}  onPress={() => Cadastrar(name, email, senha, confirmaSenha, data_nascimento)}>
                <Text style={styles.buttonText}>Cadastrar</Text>
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
            <TouchableOpacity style={styles.cadastre} activeOpacity={0.9} onPress={() => router.navigate('/entre')}>
                <Text style={styles.text}>Já tem uma conta?</Text>
                <Text style={[styles.text, { textDecorationLine: 'underline', fontWeight: 'bold' }]}>Entre</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 10,
    },
    image: {
        width: 130,
        height: 130,
    },
    title: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30,
        fontFamily: 'Roboto_700Bold',
        marginBottom: 20,
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