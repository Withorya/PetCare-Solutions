import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const data = [
    { label: 'Labrador Retriever', value: 'labrador' },
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
    { label: 'Shih Tzu', value: 'shih_tzu' },
    { label: 'Cocker Spaniel', value: 'cocker_spaniel' },
    { label: 'Maltês', value: 'maltese' },
    { label: 'Chihuahua', value: 'chihuahua' },
    { label: 'Pug', value: 'pug' },
    { label: 'Schnauzer', value: 'schnauzer' },
    { label: 'Buldogue Francês', value: 'french_bulldog' },
    { label: 'Buldogue Inglês', value: 'english_bulldog' },
    { label: 'Lhasa Apso', value: 'lhasa_apso' },
    { label: 'Corgi', value: 'corgi' },
    { label: 'Akita', value: 'akita' },
    { label: 'Saint Bernard', value: 'saint_bernard' },
    { label: 'Bichon Frisé', value: 'bichon_frise' },
    { label: 'Bull Terrier', value: 'bull_terrier' },
    { label: 'West Highland White Terrier', value: 'west_highland_white_terrier' },
    { label: 'Spaniel Anão Continental', value: 'papillon' },
    { label: 'Cavalier King Charles Spaniel', value: 'cavalier_king_charles_spaniel' },
    { label: 'Chow Chow', value: 'chow_chow' },
    { label: 'Shar Pei', value: 'shar_pei' },
    { label: 'Pastor Australiano', value: 'australian_shepherd' },
    { label: 'Basset Hound', value: 'basset_hound' },
    { label: 'Bloodhound', value: 'bloodhound' },
    { label: 'Bullmastiff', value: 'bullmastiff' },
    { label: 'Cane Corso', value: 'cane_corso' },
    { label: 'Dogue Alemão', value: 'great_dane' },
    { label: 'Samoyeda', value: 'samoyed' },
    { label: 'Husky Siberiano', value: 'siberian_husky' },
    { label: 'Vizsla', value: 'vizsla' },
    { label: 'Weimaraner', value: 'weimaraner' },
    { label: 'Westie', value: 'westie' },
    { label: 'Airedale Terrier', value: 'airedale_terrier' },
    { label: 'Basenji', value: 'basenji' },
    { label: 'Belgian Malinois', value: 'belgian_malinois' },
    { label: 'Border Collie', value: 'border_collie' },
    { label: 'Boston Terrier', value: 'boston_terrier' },
    { label: 'Brittany Spaniel', value: 'brittany_spaniel' },
    { label: 'Cairn Terrier', value: 'cairn_terrier' },
    { label: 'Chinese Shar-Pei', value: 'chinese_shar_pei' },
    { label: 'Chow Chow', value: 'chow_chow' },
    { label: 'Clumber Spaniel', value: 'clumber_spaniel' },
    { label: 'Collie', value: 'collie' },
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
    { label: 'Bernese Mountain Dog', value: 'bernese_mountain_dog' },
    { label: 'Cocker Spaniel', value: 'cocker_spaniel' },
    { label: 'Mastiff', value: 'mastiff' },
    { label: 'Vizsla', value: 'vizsla' },
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

const DropdownComponent = () => {
const [value, setValue] = useState(null);
const [isFocus, setIsFocus] = useState(false);

const renderLabel = () => {
    if (value && isFocus) {
    return (
        <Text style={[styles.label, isFocus && { color: '#805BEF' }]}>
        Raça:
        </Text>
    );
    }
    return null;
};

return (
    <View style={styles.container}>
    {renderLabel()}
    <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#805BEF' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Selecione a raça' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
        setValue(item.value);
        setIsFocus(false);
        }}
        
    />
    </View>
);
};

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
    },
    dropdown: {
        height: 50,
       borderColor: '#838383ff',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 8,
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