import { TouchableWithoutFeedback, View, Image, ViewProps } from "react-native";
import { Link , router , useLocalSearchParams} from "expo-router";
import { styles } from './styles';
import { useState } from "react";

export type TabType ={
    here: string,
    idPet:string,
    idNextPet: string
}

export function NavBar({here,idPet,idNextPet, ...rest}:TabType){
    const [destaque,setDestaque] = useState(here)
    
    return(
        <View style={styles.navbar}>
            <View style={[styles.navItem, (destaque=="forum") && styles.here]}>
                <TouchableWithoutFeedback  onPress={() => router.navigate({pathname:'/forum', params:{id:idPet,idNextPet:idNextPet}})}>
                    <Image style={styles.pata} source={require("@/assets/images/forum.png")}></Image>
                </TouchableWithoutFeedback>
            </View>
            <View style={[styles.navItem, (destaque=="pet") && styles.here]}>
                <Link href={{pathname : "/pet", params : {id : idPet , nextPet: idNextPet}}}>
                    <Image style={styles.navImg} source={require("@/assets/images/pet.png")}></Image>
                </Link>
            </View>
            <View style={[styles.navItem, (destaque=="home") && styles.here]}>
                <TouchableWithoutFeedback  onPress={() => router.navigate('/home')}>
                    <Image style={styles.pata} source={require("@/assets/images/home.png")}></Image>
                </TouchableWithoutFeedback>
            </View>
            <View style={[styles.navItem, (destaque=="premium") && styles.here]}>
                <TouchableWithoutFeedback  onPress={() => console.log('premium')}>
                    <Image style={styles.pata} source={require("@/assets/images/premium.png")}></Image>
                </TouchableWithoutFeedback>
            </View>
            <View style={[styles.navItem, (destaque=="chatbot") && styles.here]}>
                <TouchableWithoutFeedback  onPress={() => console.log('chatbot')}>
                    <Image style={styles.pata} source={require("@/assets/images/chatbot.png")}></Image>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}