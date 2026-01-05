import Post from "@/components/Post";
import { NavBar } from "@/components/navbar";

import { router , useLocalSearchParams} from 'expo-router';
import { View , StyleSheet, FlatList} from "react-native";

export default function Forum(){
    const { id } = useLocalSearchParams<{ id: string }>();
    const { nextPet } = useLocalSearchParams<{ nextPet: string }>();
    return(
        <View style={styles.tela}>
            <FlatList data={[]} renderItem={({ item }) => (
                <Post></Post>
            )} 
            ListFooterComponent={()=>(
                <Post></Post>
            )}>

            </FlatList>

            <NavBar idPet={id} idNextPet={nextPet} here="forum"></NavBar>
        </View>
    )
}

export const styles = StyleSheet.create({
    tela:{
        width:"100%",
        height:"100%",
        alignItems:'center'
    },

})