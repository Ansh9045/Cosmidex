import { View, Text, Pressable, Image } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAppContext } from '../contexts/AppContext'

const TABS = [
    { route: 'Home', label: 'Home', icon: require('../../assets/home.png') },
    { route: 'All', label: 'Pokedex', icon: require('../../assets/pokeball.png') },
    { route: 'Camera', label: 'Camera', icon: require('../../assets/camera.png') },
    { route: 'Upload', label: 'Upload', icon: require('../../assets/gallery.png') },
]

const Tab = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {resetBackground} = useAppContext()

    return (
        <View className="absolute bottom-0 w-full flex-row justify-between items-center bg-[#0C1125] border-2 border-[#75DDAE] rounded-full px-1 py-2">
            {TABS.map((tab) => {
                const active = route.name === tab.route
                return (
                    <Pressable
                        key={tab.route}
                        onPress={() => {
                            if (!active) navigation.navigate(tab.route)
                            if (tab.route ==="Home"){
                                resetBackground()
                            }
                        }}
                        className={`flex-1 items-center py-2 mx-1 rounded-full ${active ? 'bg-p1/20 border border-[#75DDAE]' : ''}`}
                    >
                        <Image
                            source={tab.icon}
                            className="h-6 w-6"
                            tintColor={active ? '#79E7B8' : '#75DDAE80'}
                        />
                        <Text className={`text-xs mt-1 ${active ? 'text-[#79E7B8] font-bold' : 'text-text1/60'}`}>
                            {tab.label}
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

export default Tab