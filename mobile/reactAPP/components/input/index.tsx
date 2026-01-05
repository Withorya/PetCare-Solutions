import { TextInput,TextInputProps, Text, View} from "react-native";
import { styles } from './styles';
import { useState } from "react";

type Props = TextInputProps & {
    valueChange: ((text:string)=>void)|undefined
}

export function Input({valueChange,...rest} : Props) {
    const [isFocus,setIsFocus] = useState(false)
    const [value,setValue] = useState('')
    const renderLabel = () => {
        if (value !==""|| isFocus) {
        return (
            <Text style={[styles.label, isFocus && { color: '#2b2b2bff' }]}>
            {rest.placeholder}
            </Text>
        );
        }
        return null;
    };
    return(
        <View style={styles.container}>
            {renderLabel()}
            <TextInput 
                style={styles.input} 
                {...rest} 
                onFocus={() => setIsFocus(true)} 
                onBlur={() => setIsFocus(false)}
                value={value}
                onChangeText={(txt)=>{
                    setValue(txt)
                    if (valueChange) {
                        valueChange(txt)
                    }
                }}
            />
        </View>
    )
}
