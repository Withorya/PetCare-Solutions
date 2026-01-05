import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#805BEF',
        position: 'absolute',
        bottom: 10,
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
        justifyContent:'center'
    },
    navText: {
        fontSize: 12,
        marginTop: 4,
        color: '#333',
    },
    navImg:{
        height:40,
        width:40
    },
    here:{
        width:55,
        height:55,
        backgroundColor:"#F2C438", 
        borderRadius:35, 
        paddingBottom:7
    },
    pata:{
        height:35,
        width:35
    },
});