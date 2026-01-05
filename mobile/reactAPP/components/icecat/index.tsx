
import Rive from 'rive-react-native';

export default function IceCat() {
    return (
        <Rive
            resourceName="icecat"
            autoplay={true}
            style={{ width: 300, height: 300 }}
        />
    );
}