import { View , Text, TouchableOpacity, Image, Button, StyleSheet, Pressable} from "react-native";
import { Input } from "@/components/input";
import { Dropdown } from 'react-native-element-dropdown';
import { router, usePathname } from "expo-router";
import { useState, useEffect } from "react";
import { DatePica} from "@/components/datepicker"
import {} from "react-native-toast-message"
import{ Pet } from "@/objects/pet";

import { useDatabase } from "@/database/useDatabase";


const data = [
    { label: 'Labrador Retriever', value: 'labrador' },
    { label: 'Vira-lata', value: 'vira_lata' },
    { label: 'Pastor Alemão', value: 'german_shepherd' },
    { label: 'Golden Retriever', value: 'golden_retriever' },
    { label: 'Bulldog', value: 'bulldog' },
    { label: 'Beagle', value: 'beagle' },
    { label: 'Poodle', value: 'poodle' },
    { label: 'Rottweiler', value: 'rottweiler' },
    { label: 'Yorkshire Terrier', value: 'yorkshire_terrier' },
    { label: 'Boxer', value: 'boxer' },
    { label: 'Salcicha', value: 'dachshund' },
    { label: 'Dálmata', value: 'dalmatian' },
    { label: 'Doberman', value: 'doberman' },
    { label: 'Maltês', value: 'maltese' },
    { label: 'Chihuahua', value: 'chihuahua' },
    { label: 'Pug', value: 'pug' },
    { label: 'Schnauzer', value: 'schnauzer' },
    { label: 'Buldogue Francês', value: 'french_bulldog' },
    { label: 'Buldogue Inglês', value: 'english_bulldog' },
    { label: 'Corgi', value: 'corgi' },
    { label: 'Akita', value: 'akita' },
    { label: 'Saint Bernard', value: 'saint_bernard' },
    { label: 'Bull Terrier', value: 'bull_terrier' },
    { label: 'Spaniel Anão Continental', value: 'papillon' },
    { label: 'Shar Pei', value: 'shar_pei' },
    { label: 'Basset Hound', value: 'basset_hound' },
    { label: 'Bloodhound', value: 'bloodhound' },
    { label: 'Bullmastiff', value: 'bullmastiff' },
    { label: 'Cane Corso', value: 'cane_corso' },
    { label: 'Samoyeda', value: 'samoyed' },
    { label: 'Vizsla', value: 'vizsla' },
    { label: 'Weimaraner', value: 'weimaraner' },
    { label: 'Westie', value: 'westie' },
    { label: 'Basenji', value: 'basenji' },
    { label: 'Brittany Spaniel', value: 'brittany_spaniel' },
    { label: 'Cairn Terrier', value: 'cairn_terrier' },
    { label: 'Chow Chow', value: 'chow_chow' },
    { label: 'Clumber Spaniel', value: 'clumber_spaniel' },
    { label: 'Pembroke Welsh Corgi', value: 'pembroke_welsh_corgi' },
    { label: 'Siberian Husky', value: 'siberian_husky' },
    { label: 'Australian Shepherd', value: 'australian_shepherd' },
    { label: 'Great Dane', value: 'great_dane' },
    { label: 'Doberman Pinscher', value: 'doberman_pinscher' },
    { label: 'Cavalier King Charles Spaniel', value: 'cavalier_king_charles_spaniel' },
    { label: 'Shih Tzu', value: 'shih_tzu' },
    { label: 'Boston Terrier', value: 'boston_terrier' },
    { label: 'Pomeranian', value: 'pomeranian' },
    { label: 'Havanese', value: 'havanese' },
    { label: 'Shetland Sheepdog', value: 'shetland_sheepdog' },
    { label: 'Brittany', value: 'brittany' },
    { label: 'English Springer Spaniel', value: 'english_springer_spaniel' },
    { label: 'Cocker Spaniel', value: 'cocker_spaniel' },
    { label: 'Mastiff', value: 'mastiff' },
    { label: 'Newfoundland', value: 'newfoundland' },
    { label: 'Border Collie', value: 'border_collie' },
    { label: 'Rhodesian Ridgeback', value: 'rhodesian_ridgeback' },
    { label: 'West Highland White Terrier', value: 'west_highland_white_terrier' },
    { label: 'Shiba Inu', value: 'shiba_inu' },
    { label: 'Bichon Frise', value: 'bichon_frise' },
    { label: 'Shar-Pei Chines', value: 'chinese_shar_pei' },
    { label: 'Terrier Escocês', value: 'scottish_terrier' },
    { label: 'Staffordshire Bull Terrier', value: 'staffordshire_bull_terrier' },
    { label: 'Irish Setter', value: 'irish_setter' },
    { label: 'Malamute do Alasca', value: 'alaskan_malamute' },
    { label: 'Chesapeake Bay Retriever', value: 'chesapeake_bay_retriever' },
    { label: 'Airedale Terrier', value: 'airedale_terrier' },
    { label: 'Pastor Belga Malinois', value: 'belgian_malinois' },
    { label: 'Collie', value: 'collie' },
    { label: 'Galgo Italiano', value: 'italian_greyhound' },
    { label: 'Whippet', value: 'whippet' },
    { label: 'Setter Gordon', value: 'gordon_setter' },
    { label: 'Bobtail', value: 'old_english_sheepdog' },
    { label: 'Galgo afegão', value: 'afghan_hound' },
    { label: 'Keeshond', value: 'keeshond' },
    { label: 'Lhasa Apso', value: 'lhasa_apso' },
    { label: 'Elkhound', value: 'norwegian_elkhound' },
    { label: 'Pequeno basset griffon da Vendeia', value: 'petit_basset_griffon_vendeen' },
    { label: 'Saluki', value: 'saluki' },
    { label: 'Skye Terrier', value: 'skye_terrier' },
    { label: 'Terrier tibetano', value: 'tibetan_terrier' },
    { label: 'Terrier Galês', value: 'welsh_terrier' },
    { label: 'Griffon de aponte de pelo duro', value: 'wirehaired_pointing_griffon' },
    { label: 'Pelado-mexicano', value: 'xoloitzcuintli' },
    { label: 'Dandie Dinmont Terrier', value: 'dandie_dinmont_terrier' },
    { label: 'Fila Brasileiro', value: 'fila_brasileiro' },
    { label: 'Cão de água português', value: 'portuguese_water_dog' },
    { label: 'Cão de montanha dos Pirenéus', value: 'pyrenean_mountain_dog' },
    { label: 'Pastor da Anatólia', value: 'anatolian_shepherd_dog' },
    { label: 'Cão da Córsega', value: 'berger_de_corse' },
    { label: 'Cão da Serra da Estrela', value: 'estrela_mountain_dog' },
    { label: 'Pastor do cáucaso', value: 'caucasian_shepherd_dog' },
    { label: 'Cão islandês de pastoreio', value: 'icelandic_sheepdog' },
    { label: 'Cão de pastor sueco', value: 'swedish_vallhund' },
    { label: 'Cão lobo checoslovaco', value: 'czechoslovakian_vlcak' },
    { label: 'Husky siberiano', value: 'siberian_lupus' },
    { label: 'Cão de montanha', value: 'bernese_mountain_dog' },
    { label: 'Cão de montanha do Tibete', value: 'tibetan_mastiff' },
    { label: 'Kangal Dog', value: 'kangal' },
    { label: 'Komondor', value: 'komondor' },
    { label: 'Kuvasz', value: 'kuvasz' },
    { label: 'Maremma Sheepdog', value: 'maremma_sheepdog' },
    { label: 'Pastor Polonês de Podhale', value: 'polish_tatra_shepherd_dog' },
    { label: 'Pastor Romeno da Bucovina', value: 'romanian_mioritic_shepherd_dog' },
    { label: 'Tornjak', value: 'tornjak' }
];


export default function CadastroPet() {
    const [racaValue, setRacaValue] = useState(null);
    const [racaIsFocus, setRacaIsFocus] = useState(false);
    const [porteValue, setPorteValue] = useState(null);
    const [porteIsFocus, setPorteIsFocus] = useState(false);
    const [generoValue, setGeneroValue] = useState(null);
    const [generoIsFocus, setGeneroIsFocus] = useState(false);
    const [especie, setEspecieValue] = useState('Cão');
    const [nome, setNome] = useState('');
    const [dataNasc, setDataNasc] = useState<Date>();
    const [raca, setRaca] = useState('');
    const [peso, setPeso] = useState('');
    const [cor, setCor] = useState('');
    const [porte, setPorte] = useState('');
    const [genero, setGenero] = useState('');
    const [donoId, setDonoId] = useState('');
    const db = useDatabase();

    const renderRacaLabel = () => {
        if (racaValue || racaIsFocus) {
        return (
            <Text style={[styles.label, racaIsFocus && { color: '#805BEF' }]}>
            Raça:
            </Text>
        );
        }
        return null;
    };
    const renderPorteLabel = () => {
        if (porteValue || porteIsFocus) {
        return (
            <Text style={[styles.label, porteIsFocus && { color: '#805BEF' }]}>
            Porte:
            </Text>
        );
        }
        return null;
    };
    const renderGeneroLabel = () => {
        if (generoValue || generoIsFocus) {
        return (
            <Text style={[styles.label, generoIsFocus && { color: '#805BEF' }]}>
            Genero:
            </Text>
        );
        }
        return null;
    }  

    async function cadastrarPet() {
        if (nome === "" || dataNasc === undefined || raca === "" || peso === "" || cor === "" || porte === "" || genero === "") {
            var imcompleto = ''
            if (nome === "") {
                imcompleto+=' nome'
            }
            if (dataNasc === undefined) {
                imcompleto+=' data de nascimento'
            }
            if (raca === "") {
                imcompleto+=' raça'
            }
            if (peso === "") {
                imcompleto+=' peso'
            }
            if (cor === "") {
                imcompleto+=' cor'
            }
            if (porte === "") {
                imcompleto+=' porte'
            }
            if (genero === "") {
                imcompleto+=' genero'
            }
            alert("Os campos : "+imcompleto+" não foram preenchidos. Por favor, preencha todos os campos.");

            return;
        }
        if (isNaN(Number(peso))) {
            alert("Por favor, insira um peso válido.");
            return;
        }
        
        await db.getUser().then((dado)=> {
            dado.map((user)=>{
                setDonoId(String(user.Id_Usuario))
                
            })
        })

        const pet = new Pet(especie,nome,new Date(dataNasc),raca,Number(peso),cor,porte,genero,Number(donoId))
        
        pet.register().then((retorno)=>{
            console.log(retorno)
            if (retorno==0) {
                db.create(pet)
                router.replace({pathname : "/pet", params : {id : pet.id , nextPet: pet.id}})
            }
        })
        return;
    }

    return (
        <View style={styles.container}>
            <>
                <TouchableOpacity style={{position: 'absolute', top: 40, left: 20}} activeOpacity={0.9} onPress={() => router.back()}>
                    <Image style={{height:30,width:30}} source={require('@/assets/images/arrowleft.png')} />
                </TouchableOpacity>
                <Image style={styles.image} source={require("@/assets/images/logoColor.png")} />
                <Text style={styles.title}>Cadastre seu Pet</Text>
                <View style={styles.outros }>
                    <Pressable style={[styles.imgeButton,  (especie == "Cão") && {backgroundColor:'#b19eebff'}]} onPress={() => 
                        setEspecieValue('Cão')
                        }>
                        <Image style={styles.img} source={require('@/assets/images/dog.png')} />
                    </Pressable>
                    <Pressable style={[styles.imgeButton,  (especie == "Gato") && {backgroundColor:'#b19eebff'}]} onPress={() => 
                        setEspecieValue('Gato')
                        }>
                        <Image style={[styles.img,{marginLeft:6}]} source={require('@/assets/images/cat.png')} />
                    </Pressable>
                </View>
                {/* Formulário de cadastro */}
                <Input placeholder="Nome" valueChange={(txt) =>{
                    setNome(txt);
                    
                    }} value={nome}/>
                <DatePica title="Data De Nascimento" valueButton={(txt)=>{
                    console.log(txt)
                    setDataNasc(txt)
                }}></DatePica>
                <View style={styles.container2}>
                    {renderRacaLabel()}
                    <Dropdown
                        style={[styles.dropdown, racaIsFocus && { borderColor: '#805BEF' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!racaIsFocus ? 'Selecione a raça' : '...'}
                        searchPlaceholder="Search..."
                        value={racaValue}
                        onFocus={() => setRacaIsFocus(true)}
                        onBlur={() => setRacaIsFocus(false)}
                        onChange={item => {
                        setRacaValue(item.value);
                        setRaca(item.label);
                        setRacaIsFocus(false);
                        }}
                        
                    />
                </View>
                <Input keyboardType="numeric" placeholder="Peso em kilos" valueChange={(txt) =>{
                    setPeso(txt);
                    
                    }}/>
                <Input placeholder="Cor" valueChange={(txt) =>{
                    setCor(txt);
                    
                    }} />
                <View style={styles.container2}>
                    {renderPorteLabel()}
                    <Dropdown
                        style={[styles.dropdown, porteIsFocus && { borderColor: '#805BEF' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={["Pequeno", "Médio", "Grande"].map((porte) => ({ label: porte, value: porte }))}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!porteIsFocus ? 'Selecione o porte' : '@.'}
                        value={porteValue}
                        onFocus={() => setPorteIsFocus(true)}
                        onBlur={() => setPorteIsFocus(false)}
                        onChange={item => {
                        setPorteValue(item.value);
                        setPorte(item.label);
                        setPorteIsFocus(false);
                        }}
                        
                    />
                </View>
                <View style={styles.container2}>
                    {renderGeneroLabel()}
                    <Dropdown
                        style={[styles.dropdown, generoIsFocus && { borderColor: '#805BEF' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={["Macho","Femea"].map((genero) => ({ label: genero, value: genero.toLowerCase() }))}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!generoIsFocus ? 'Selecione o genero' : '...'}
                        value={generoValue}
                        onFocus={() => setGeneroIsFocus(true)}
                        onBlur={() => setGeneroIsFocus(false)}
                        onChange={item => {
                            setGeneroValue(item.value);
                            setGenero(String(item.label).toLowerCase());
                            setGeneroIsFocus(false);
                        }}
                        
                    />
                </View>
                
                <TouchableOpacity style={styles.button} activeOpacity={0.9}  onPress={() =>{cadastrarPet()}}>
                    <Text style={styles.buttonText}>Cadastrar Pet</Text>
                </TouchableOpacity>
            </>
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
        width: 100,
        height: 100,
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
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#000000ff',
    },
    img:{
        width: 50,
        height: 50,
    },
    outros:{
        flexDirection: 'row',
        gap: 30,
        marginTop: 10,
    },
    container2: {
        backgroundColor: 'white',
        width: '100%',
    },
    dropdown: {
        height: 50,
       borderColor: '#838383ff',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 8,
        width: '100%',
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 5,
        top: -10,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});