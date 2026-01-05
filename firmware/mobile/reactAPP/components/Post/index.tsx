import { View, Image, Text, TouchableHighlight} from "react-native";
import { styles } from "./styles";

export default function Post(){
    return(
        <View style={styles.tela}>
            <View style={styles.user}>
                <Image source={require('@/assets/images/user.png')} style={styles.userFoto}></Image>
                <Text style={styles.userNome}>@nome</Text>
            </View>
            <View style={styles.conteudo}>
                {true?
                <View>
                    <Image source={require('@/assets/images/dog.png')}></Image>
                    <Text>dogões são fodas</Text>
                </View>
                :
                <Text></Text>
                }
            </View>
            <View style={styles.numeros}>
                <View>
                    <Image source={require("@/assets/images/likes.png")}></Image>
                    <Text>0</Text>
                </View>
                <View>
                    <Image source={require("@/assets/images/coments.png")}></Image>
                    <Text>0</Text>
                </View>
            </View>
        </View>
    )
}