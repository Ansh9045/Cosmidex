import {View, Text} from 'react-native'
import {useAppContext} from '../contexts/AppContext'
import Medal from './Medal'

const CatchToast = ()=>{
    const {catchMessage} = useAppContext()
    if (!catchMessage) return null
    if (catchMessage.isMedal){
        return <Medal/>
    }

    return(
        <View className="absolute top-16 self-center bg-[#0C1125]/90 px-5 py-3 rounded-full border-2 z-50 max-w-[85%]" style={{borderColor: "#75DDAE"}}>
            <Text className='font-bold text-center text-text1'>{catchMessage.text}</Text>
        </View>
    )
}

export default CatchToast