import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container:{
        width: '100%',
        height:50,
        backgroundColor:"#ffffff"
    },
    input: {
        height: '100%',
        width: '100%',
        borderColor: '#838383ff',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#2b2b2bff',
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 5,
        top: -10,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        borderRadius:10
    }
});