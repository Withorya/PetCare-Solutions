import { View , Text, StyleSheet, Image, TouchableWithoutFeedback, ScrollView, TouchableOpacity, ImageSourcePropType, Platform, Alert, Linking} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, use } from "react";
import RNFS from 'react-native-fs'
import { Buffer } from 'buffer'
import {Input} from "@/components/input";
import { Pet } from "@/objects/pet";
import { Vacina } from "@/objects/vacina";
import NetInfo from "@react-native-community/netinfo";
import DatePicker from "@react-native-community/datetimepicker";
import { useDatabase } from "@/database/useDatabase";
import LoadCat from "@/components/loadcat";
import * as ImagePicker from 'expo-image-picker'
import { NavBar } from "@/components/navbar";
import { platform } from "os";
export default function PagPet() {
    const database = useDatabase()
    const [bloba,setBlob]= useState<any>()
    const [petData, setPetData] = useState<Pet>(new Pet("","0",'',"",0,"","","",0,));
    const [anos,setAnos] = useState('') 
    const [prox,setProx] = useState('')
    const [vacinas, setVacinas] = useState<Vacina[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [popUpVisible, setPopupVisible] = useState(false);
    const [vacinaName, setVacinaName] = useState("");
    const [vacinaDate, setVacinaDate] = useState(new Date());
    const [nextDoseDate, setNextDoseDate] = useState<Date>();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDateDosePicker, setShowDateDosePicker] = useState(false);
    const hj = new Date().getFullYear()
    const [status,requestPermission] = ImagePicker.useMediaLibraryPermissions()

    const pickImage = async () =>{
        try {
            if (Platform.OS != 'web') {
                const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
                console.log(status)
                if(status !=='granted'){
                    const permissionResponse = await requestPermission()
                    if(permissionResponse.status !=='granted'){
                        Alert.alert(
                            "Permissão negada",
                            "Você precisa liberar o aplicativo a selecionar uma imagem da galeria",
                            [
                                {
                                    text:"Abrir permissões",
                                    onPress:()=>{
                                        Platform.OS=='ios'?
                                        Linking.openURL('app-settings:'):
                                        Linking.openSettings()
                                    }
                                },
                                {
                                    text:'Cancelar'
                                }
                            ]
                        )
                    }
                    return
                }
            }
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:['images'],
                allowsEditing:true,
                aspect:[4,3],
                quality:1,
                base64:true,
            })
            
            if(!result.canceled){
                 
                console.log(result.assets[0].mimeType)
                //@ts-ignore
                saveBase64AsFile(result.assets[0].base64,"imagePet",result.assets[0].mimeType)
                
                setBlob(result.assets[0].uri)
            }
        } 


        
        catch (error) {
            throw error
        }
    }

    const saveBase64AsFile = async (base64String : string, fileName: string, mimeType: string) => {
        // A string base64 pura, sem o cabeçalho 'data:...'
        const rawBase64Data = base64String.split(',').pop(); 

        const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        //@ts-ignore
        await RNFS.writeFile(path, rawBase64Data, 'base64');

       

        
        const files ={
            uri: `file://${path}`,
            type: mimeType,
            name: fileName,
        };
        await  petData.update( files)
        // RNFS.unlink(path);
    };

    

    function selectData(){
        setShowDatePicker(true);
    }

    function selectDoseData(){
        setShowDateDosePicker(true);
        
    }

    const { id } = useLocalSearchParams<{ id: string }>();
    const { nextPet } = useLocalSearchParams<{ nextPet: string }>();
    
    
   

    
    

    async function fetchPetData() {
        
        NetInfo.fetch().then(state => {
            if(!state.isConnected){
                const pet = new Pet("","0",'',"",0,"","","",0,);
                database.getPet(Number(id)).then((data)=>{
                    if(data.length>0){
                        pet.id = data[0].Id_pet;
                        pet.donoId = data[0].Id_Usuario;
                        
                        pet.nome = data[0].Nome;    
                        pet.especie = data[0].Especie;
                        
                        pet.dataNasc = data[0].Data_nascimento
                        pet.raca = data[0].Raca;
                        pet.peso = data[0].Peso;
                        pet.cor = data[0].Cor;
                        pet.genero = data[0].Sexo;
                        pet.porte = data[0].Porte;
                        pet.descricao = data[0].descricao
                        setPetData(pet);
                        
                        setBlob(pet.photo)
                        
                    }
                })
                
                database.getVacs(Number(id)).then((data)=>{
                    data.forEach((vacina)=>{
                        pet.vacinas?.push(new Vacina(Number(vacina.Id_vacina),Number(vacina.id_pet),Number(vacina.id_usuario),String(vacina.nomeVac),vacina.dataVacina,vacina.dataProxDose?vacina.dataProxDose:undefined))
                    })
                    setVacinas(pet.vacinas||[]);
                    setIsLoading(false);
                })
            }else{
                const pet = new Pet("","0",'',"",0,"","","",0,);
                
                database.getPet(Number(id)).then((data)=>{
                    if(data.length>0){
                        pet.id = data[0].Id_pet;
                        pet.donoId = data[0].Id_Usuario;
                        pet.nome = data[0].Nome;    
                        pet.especie = data[0].Especie;
                        pet.dataNasc =  data[0].Data_nascimento
                        pet.raca = data[0].Raca;
                        pet.peso = data[0].Peso;
                        pet.cor = data[0].Cor;
                        pet.genero = data[0].Sexo;
                        pet.porte = data[0].Porte;
                        pet.descricao = data[0].descricao
                        // console.log(data[0].Foto)
                        setBlob(data[0].Foto)
                        
                        
                        setPetData(pet);
                        
                        if (Number(new Date().getFullYear()) - Number(data[0].Data_nascimento.slice(0,4))>0) {
                            if (Number(new Date().getMonth()+1)-Number(data[0].Data_nascimento.slice(5,7))>0) {
                                let anos = String(Number(new Date().getFullYear())-Number(data[0].Data_nascimento.slice(0,4)))
                                let meses = String(Number(new Date().getMonth()+1)-Number(data[0].Data_nascimento.slice(5,7)))
                                setAnos(anos+','+meses+' anos')
                            }else if(Number(new Date().getMonth()+1)-Number(data[0].Data_nascimento.slice(5,7))<0) {
                                let anos = String(Number(new Date().getFullYear())-Number(data[0].Data_nascimento.slice(0,4)))
                                let meses = String(Number(data[0].Data_nascimento.slice(5,7))-Number(new Date().getMonth()+1))
                                setAnos(anos+','+meses+' anos')
                            }else{
                                let anos = String(Number(new Date().getFullYear())-Number(data[0].Data_nascimento.slice(0,4)))
                                let meses = String(Number(data[0].Data_nascimento.slice(5,7))-Number(new Date().getMonth()+1))
                                setAnos(anos+','+meses+' anos')
                            }
                        }else{
                            if (Number(new Date().getMonth()+1)-Number(data[0].Data_nascimento.slice(5,7))>0) {
                                let meses = String(Number(new Date().getMonth()+1)-Number(data[0].Data_nascimento.slice(5,7)))
                                setAnos(meses+' meses')
                            }else if(Number(new Date().getMonth()+1)-Number(data[0].Data_nascimento.slice(5,7))<0) {
                                let meses = String(Number(data[0].Data_nascimento.slice(5,7))-Number(new Date().getMonth()+1))
                                setAnos(meses+' meses')
                            }else{
                                let meses = String(Number(data[0].Data_nascimento.slice(5,7))-Number(new Date().getMonth()+1))
                                setAnos(meses+' meses')
                            }
                        }
                        
                    }
                    
                   
                    pet.searchVacinas().then((status)=>{
                        
                        if (status == 0) {
                            pet.vacinas?.forEach(async(vacina)=>{
                                database.create(vacina)
                                
                            })
                            
                            setVacinas(pet.vacinas||[]);
                            
                            setIsLoading(false);
                            
                        }else{
                            setVacinas([])
                            setIsLoading(false);
                        }
                        
                    })
                })   
            }
        })
        
    }
    
    return (
        <View onLayout={fetchPetData} style={{flex:1, backgroundColor:"#FFFAEF"}}>
            {isLoading ? (
                popUpVisible ? (

                    <View style={{alignItems:"center",height:"100%", paddingBottom:80}}>
                        <View style={styles.backPopUp}>
                            <View style={{gap:5,padding:20,width:"80%", backgroundColor:"#fff", borderRadius:20, top:"30%", alignItems:"center", justifyContent:"center"}}>  
                                <Text style={{fontSize:20, fontWeight:"bold", marginBottom:20}}>Registrar Vacina</Text>
                                <Input placeholder="Nome da Vacina" valueChange={(text)=>setVacinaName(text)}></Input>
                                <TouchableOpacity onPress={selectData} style={{borderColor:"#777777ff",borderWidth:2, width:"100%", height:50, backgroundColor:"#ffffffff", alignItems:"center", justifyContent:"center", borderRadius:10}}>
                                    <Text>Data da Vacina: {vacinaDate.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={selectDoseData} style={{borderColor:"#777777ff",borderWidth:2, width:"100%", height:50, backgroundColor:"#ffffffff", alignItems:"center", justifyContent:"center", borderRadius:10}}>
                                    <Text>Data da Proxima Dose: {nextDoseDate===undefined?"Sem Proxima dose":nextDoseDate.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DatePicker
                                    // key
                                        value={vacinaDate
                                        }
                                        mode="date"
                                        display="spinner"
                                        onChange={(event, selectedDate) => {
                                            const currentDate = selectedDate || vacinaDate;
                                            setShowDatePicker(false);
                                            setVacinaDate(currentDate);
                                        }
                                        }
                                    />
                                )}
                                {showDateDosePicker ? (
                                    <DatePicker
                                        value={nextDoseDate || new Date()}
                                        mode="date"
                                        display="spinner"
                                        
                                        onChange={(event, selectedDate) => {
                                            const currentDate = selectedDate || nextDoseDate;
                                            setShowDateDosePicker(false);
                                            setNextDoseDate(currentDate);
                                        }}
                                    />
                                ):(null)}
                                <TouchableOpacity style={{width:"60%", height:50, backgroundColor:"#805BEF", borderRadius:10, alignItems:"center", justifyContent:"center"}} onPress={async()=>{
                                    if(vacinaName==""){
                                        alert("Por favor, insira o nome da vacina.");
                                        return;
                                    }
                                    setPopupVisible(false)
                                    petData.registerVac(vacinaName, vacinaDate, nextDoseDate||null).then( respost =>{
                                        petData.searchVacinas().then(()=>{
                                           setVacinas(petData.vacinas||[]) 
                                           setIsLoading(false)
                                        })
                                    });
                                }}>
                                    <Text style={{fontSize:18, fontWeight:"bold", textAlign:"center",color:"#fff"}}>Adicionar Vacina</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:"60%", height:50, backgroundColor:"#805BEF", borderRadius:10, alignItems:"center", justifyContent:"center"}} onPress={async()=>{
                                    setIsLoading(false)
                                    setPopupVisible(false)  
                                }}>
                                    <Text style={{fontSize:18, fontWeight:"bold", textAlign:"center",color:"#fff"}}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>  
                        </View>
                        <View style={styles.topShadow}/>
                        <Text style={{fontSize:35, fontWeight:"900",zIndex:10,top:'5%', position:"absolute", color:"#000000"}}>Página do Pet</Text>
                        <View style={styles.petInfo}>
                            <Image style={styles.petImage} resizeMode="cover" source={(petData.especie==="Cão"?require('@/assets/images/cachorro.jpeg'):require('@/assets/images/gato.jpeg'))}></Image>
                            <View style={styles.basicInfo}>
                                <View style={{flexDirection:"row", alignItems:"center", width:"60%"}}>
                                    <Text style={styles.nome}>{petData.nome}</Text>
                                    <Image style={styles.genImg} source={(petData.genero=="Macho"||"macho"?require("@/assets/images/macho.png"):require("@/assets/images/femea.png"))}/>
                                </View>
                                <Text style={styles.raca}>{petData.raca}</Text>
                            </View>
                            <Text style={{fontSize:16, color:"#000000ff"}}>{petData.especie}</Text>
                            <Text style={{fontSize:16, color:"#000000ff"}}>{anos}</Text>
                        </View>
                        
                        <View style={styles.petPeso}>
                            <View style={styles.racaoInfo}>
                                <View style={{marginTop:20,flexDirection:"row", alignItems:"center", width:"100%", justifyContent:"space-around",paddingHorizontal:10}}>
                                    <Text style={{fontSize:14, fontWeight:"bold", color:"#000000", width:"60%"}}>Quantidade de Ração</Text>
                                    <Image style={styles.genImg} source={require("@/assets/images/balanca.png")}></Image>
                                </View>
                                <View style={{marginTop:20,flexDirection:"row", alignItems:"flex-end", width:"100%", justifyContent:"center"}}>
                                    <Text style={{fontSize:38, fontWeight:"bold", color:"#000000"}}>400</Text>
                                    <Text style={{fontSize:20,marginBottom:5}}>gm</Text>
                                </View>
                            </View>
                            <View style={[styles.racaoInfo,{ backgroundColor:"#805BEF"}]}>
                                <View style={{marginTop:20,flexDirection:"row", alignItems:"center", width:"100%", justifyContent:"space-around",paddingHorizontal:10}}>
                                    <Text style={{fontSize:14, fontWeight:"bold", color:"#ffffffff", width:"60%"}}>Peso do animal</Text>
                                    <Image style={styles.genImg} source={require("@/assets/images/osso.png")}></Image>
                                </View>
                                <View style={{marginTop:20,flexDirection:"row", alignItems:"flex-end", width:"100%", justifyContent:"center"}}>
                                    <Text style={{fontSize:38, fontWeight:"bold", color:"#ffffffff"}}>{petData.peso}</Text>
                                    <Text style={{fontSize:20,marginBottom:5,color:'#fff'}}>kg</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.vacinas}>
                            <Text style={{fontSize:26,fontWeight:'bold', color:"#ffffffff", marginTop:15, marginBottom:10}}>
                                Vacinas:
                            </Text>
                        
                            {vacinas.length == 0 ? (
                                <View style={{ width:"100%"}}>
                                    
                                    <Text style={{fontSize:18, color:"#000000ff",width:"60%"}}>Nenhuma vacina registrada</Text>
                                        
                                </View>
                            ) : (
                                vacinas.map((vacina)=>(
                                    <View key={vacina.Id_Vacina} style={{width:"100%",backgroundColor:"#fff",padding:10,flexDirection:"row"}}>
                                        <Text style={{fontSize:22, color:"#000000ff",width:"60%"}}>{vacina.Nome} </Text>
                                        <Text style={{fontSize:22, color:"#000000ff",width:"40%"}}>| {vacina.DataProxDose?(Number(vacina.DataProxDose.slice(8,10))-Number(vacina.DataVacina.slice(8,10))+((Number(vacina.DataProxDose.slice(5,7))-Number(vacina.DataVacina.slice(5,7)))*30))+' dias':'Sem Próxima Dose'}</Text>
                                    </View>
                                ))
                            )}
                            <TouchableOpacity activeOpacity={0.9} style={{backgroundColor:"#fff",justifyContent:"center",width:"100%",padding:20,borderBottomLeftRadius:20,borderBottomRightRadius:20,flexDirection:"row"}}onPress={()=>{
                                        setPopupVisible(true)
                                        setIsLoading(true)
                            }}>
                                <Text style={{fontSize:20, color:"#000000ff",fontWeight:'500'}}>Adicionar Vacina</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.navbar}>
                            <TouchableWithoutFeedback style={styles.navItem} >
                                <Image style={styles.navImg} source={require("@/assets/images/forum.png")}></Image>
                            </TouchableWithoutFeedback>
                            <View style={styles.here}>
                                <Link style={styles.navItem} href={{pathname : "/pet", params : {id : nextPet, nextPet: id}}}>
                                    <Image style={styles.navImg} source={require("@/assets/images/pet.png")}></Image>
                                </Link>
                            </View>
                            <TouchableWithoutFeedback style={styles.navItem} >
                                <Image style={styles.navImg} source={require("@/assets/images/home.png")}></Image>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback style={styles.navItem} >
                                <Image style={styles.navImg} source={require("@/assets/images/premium.png")}></Image>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback style={styles.navItem} >
                                <Image style={styles.navImg} source={require("@/assets/images/chatbot.png")}></Image>
                            </TouchableWithoutFeedback>
                        </View>
                    
                    </View>
                ):(
                    <View style={{justifyContent:"center",alignItems:"center",height:"100%"}}>
                        <LoadCat></LoadCat>
                        <NavBar here="pet" idPet={nextPet} idNextPet={id}></NavBar>
                    </View>
                )   
            ) : ( 
                <View style={{alignItems:"center",height:"100%", paddingBottom:80}}>
                    <View style={styles.topShadow}/>
                    <Text style={{fontSize:35, fontWeight:"900",zIndex:10,top:'5%', position:"absolute", color:"#000000"}}>Página do Pet</Text>
                    <View style={styles.petInfo}>
                        
                        <TouchableOpacity activeOpacity={0.8} style={styles.addButton} onPress={pickImage}>
                            <Image style={{height:30,width:30, transform: [{ rotate: '90deg' }]}} source={require("@/assets/images/lapiscor.png")}></Image>
                        </TouchableOpacity>
                        
                        <Image style={styles.petImage} resizeMode="cover" source={bloba?{uri:bloba}:(petData.especie==="Cão"?require('@/assets/images/cachorro.jpeg'):require('@/assets/images/gato.jpeg'))}></Image>
                        <View style={styles.basicInfo}>
                            <View style={{flexDirection:"row", alignItems:"center", width:"60%"}}>
                                <Text style={styles.nome}>{petData.nome}</Text>
                                <Image style={styles.genImg} source={(petData.genero=="Macho"||"macho"?require("@/assets/images/macho.png"):require("@/assets/images/femea.png"))}/>
                            </View>
                            <Text style={styles.raca}>{petData.raca}</Text>
                        </View>
                        <Text style={{fontSize:16, color:"#000000ff"}}>{petData.especie}</Text>
                        <Text style={{fontSize:16, color:"#000000ff"}}>{anos}</Text>
                    </View>
                    
                    <View style={styles.petPeso}>
                        <View style={styles.racaoInfo}>
                            <View style={{marginTop:20,flexDirection:"row", alignItems:"center", width:"100%", justifyContent:"space-around",paddingHorizontal:10}}>
                                <Text style={{fontSize:14, fontWeight:"bold", color:"#000000", width:"60%"}}>Quantidade de Ração</Text>
                                <Image style={styles.genImg} source={require("@/assets/images/balanca.png")}></Image>
                            </View>
                            <View style={{marginTop:20,flexDirection:"row", alignItems:"flex-end", width:"100%", justifyContent:"center"}}>
                                <Text style={{fontSize:38, fontWeight:"bold", color:"#000000"}}>400</Text>
                                <Text style={{fontSize:20,marginBottom:5}}>gm</Text>
                            </View>
                        </View>
                        <View style={[styles.racaoInfo,{ backgroundColor:"#805BEF"}]}>
                            <View style={{marginTop:20,flexDirection:"row", alignItems:"center", width:"100%", justifyContent:"space-around",paddingHorizontal:10}}>
                                <Text style={{fontSize:14, fontWeight:"bold", color:"#ffffffff", width:"60%"}}>Peso do animal</Text>
                                <Image style={styles.genImg} source={require("@/assets/images/osso.png")}></Image>
                            </View>
                            <View style={{marginTop:20,flexDirection:"row", alignItems:"flex-end", width:"100%", justifyContent:"center"}}>
                                <Text style={{fontSize:38, fontWeight:"bold", color:"#ffffffff"}}>{petData.peso}</Text>
                                <Text style={{fontSize:20,marginBottom:5,color:'#fff'}}>kg</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.vacinas}>
                        <Text style={{fontSize:26,fontWeight:'bold', color:"#ffffffff", marginTop:15, marginBottom:10}}>
                            Vacinas:
                        </Text>
                       
                        <ScrollView style={{borderBottomLeftRadius:20,borderBottomRightRadius:20,width:'100%'}}>
                            {vacinas.length == 0 ? (
                                <View style={{width:"100%",backgroundColor:"#fff",padding:10,flexDirection:"row"}}>
                                    
                                    <Text style={{fontSize:18, color:"#000000ff",width:"60%"}}>Nenhuma vacina registrada</Text>
                                        
                                </View>
                            ) : (
                                vacinas.map((vacina)=>(
                                    <View key={vacina.Id_Vacina} style={{width:"100%",backgroundColor:"#fff",padding:10,flexDirection:"row"}}>
                                        <Text style={{fontSize:22, color:"#000000ff",width:"57%"}}>{vacina.Nome} </Text>
                                        <Text style={{fontSize:22, color:"#000000ff"}}>|</Text>
                                        <Text style={{fontSize:22, color:"#000000ff",width:"40%",textAlign:'right'}}>  {vacina.DataProxDose?(Number(vacina.DataProxDose.slice(8,10))-Number(vacina.DataVacina.slice(8,10))+((Number(vacina.DataProxDose.slice(5,7))-Number(vacina.DataVacina.slice(5,7)))*30))+' dias':'Sem Doses'}</Text>
                                    </View>
                                ))
                            )}
                            <TouchableOpacity activeOpacity={0.9} style={{backgroundColor:"#fff",justifyContent:"center",width:"100%",padding:20,borderBottomLeftRadius:20,borderBottomRightRadius:20,flexDirection:"row"}}onPress={()=>{
                                        setPopupVisible(true)
                                        setIsLoading(true)
                            }}>
                                <Text style={{fontSize:20, color:"#000000ff",fontWeight:'500'}}>Adicionar Vacina</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    <NavBar here="pet" idPet={nextPet} idNextPet={id}></NavBar>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    backPopUp:{
        alignItems:"center",
        width: '100%',
        height: "150%",
        backgroundColor: '#000000aa',
        top: 0,
        position: 'absolute',
        left: 0,
        zIndex:11,
    },
    topShadow:{
        width: '100%',
        height: "20%",
        backgroundColor: '#F2C438',
        top: 0,
        position: 'absolute',
        left: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    petInfo:{
        flex:1,
        width: '85%',
        height: '35%',
        top: "13%",
        position: 'absolute',
        backgroundColor: '#FFFAEF',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
    },
    petImage:{
        width: '100%',      // garante largura no container
        height: 180,        // ajuste conforme layout desejado
        borderRadius: 12,
    },
    addButton:{
        position:'absolute',
        zIndex:101,
        top:150,
        right:30,
        height:40,
        width:40,
        backgroundColor:"#ffffffff",
        elevation: 10,
        shadowColor: '#000000ff',
        shadowOffset: {width: 0, height: 0},
        justifyContent:"center",
        alignItems:"center",
        borderRadius:50,
        marginBottom:30,
    },
    nome:{
        fontSize:29,
        fontWeight:"bold",
        marginBottom:10,
        maxWidth:"60%",
        color:"#000000"
    },
    raca:{
        fontSize:21,
        width:"40%",
        textAlign:"right",
        color:"#555555"
    },
    genImg:{
        width:35,
        height:35,
        marginLeft:10,
    },
    basicInfo:{
        flexDirection:"row",
        width:"100%",
        alignItems:"center",
        marginBottom:10,
    },
    petPeso:{
        flex:1,
        width: '85%',
        height: '17%',
        position: 'absolute',
        top: '50%',
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    racaoInfo:{
        alignItems:"center",
        width: '45%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: '#FFFAEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
    },
    vacinas:{
        width: '85%',
        maxHeight:"28%",
        position: 'absolute',
        top: '70%',
        backgroundColor: '#805BEF',
        flexDirection:"column",
        alignItems:"center",
        boxSizing:'border-box',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        borderColor:"#555555ff",
        borderWidth:1,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#805BEF',
        position: 'absolute',
        bottom: 0,
        width: '90%',
        paddingBottom: 10,
        paddingTop: 10,
        marginBottom: 10,
        borderRadius: 35,
        elevation: 10,
        shadowColor: '#000000ff',
    },
    navItem: {  
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        marginTop: 4,
        color: '#333',
    },
    navImg:{
        height:35,
        width:35
    },
    here:{
        width:55,
        height:55,
        backgroundColor:"#F2C438", 
        borderRadius:35, 
        justifyContent:"center", 
        alignItems:"center", 
        paddingBottom:5,
    }
})

