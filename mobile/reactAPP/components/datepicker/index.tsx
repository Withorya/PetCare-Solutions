import { TouchableOpacity,TouchableOpacityProps, Text, View} from "react-native";
import { styles } from './styles';
import { useState } from "react";
import DatePicker from "@react-native-community/datetimepicker";

type Props = TouchableOpacityProps & {
    title: string;
    valueButton: ((data:Date|undefined) => void) | undefined
}

export function DatePica({title,valueButton, ...res} : Props) {
    const [value,setValue]=useState<Date>()
    const [showDatePicker,setShowDatePicker] = useState(false)
    
    return(
        <View style={styles.container}>
            <TouchableOpacity {...res} onPress={()=>setShowDatePicker(true)} style={styles.button}>
                <Text>{value?value.toLocaleDateString():title}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DatePicker
                // key
                    value={value||new Date}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || value;
                        setShowDatePicker(false);
                        setValue(currentDate);
                        if (valueButton) {
                            valueButton(currentDate) 
                        }    
                    }
                    }
                />
            )}
        </View>
    )
}