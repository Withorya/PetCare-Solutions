import { SQLiteProvider } from "expo-sqlite";
import { Slot, Stack, Link} from "expo-router";
import { initializeDatabase } from "@/database/initializeDatabase";
import SystemNavigationBar from 'react-native-system-navigation-bar';


export default function layout(){
    SystemNavigationBar.fullScreen(true); 
    return(
        <SQLiteProvider databaseName="petcare.db" onInit={initializeDatabase}>
            <Stack screenOptions={{headerShown:false}}/>
            
        </SQLiteProvider>
    )
}

const styles = {
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#805BEF',
        
        
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
}