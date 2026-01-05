
import Rive from 'rive-react-native';

export default function LoadCat() {
    return (
        <Rive
            resourceName="loadcat"
            autoplay={true}
            style={{ width: 300, height: 300 }}
        />
    );
}