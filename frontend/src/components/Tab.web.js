import { View, Text, Pressable, Image } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAppContext } from '../contexts/AppContext'

import home from '../../assets/home.png'
import pokeball from '../../assets/pokeball.png'
import camera from '../../assets/camera.png'
import upload from '../../assets/gallery.png'
import home_active from '../../assets/home_active.png'
import pokeball_active from '../../assets/pokeball_active.png'
import camera_active from '../../assets/camera_active.png'
import upload_active from '../../assets/gallery_active.png'

const TABS = [
  { route: 'Home', label: 'Home', icon: home, active: home_active },
  { route: 'All', label: 'Pokedex', icon: pokeball, active: pokeball_active },
  { route: 'Camera', label: 'Camera', icon: camera, active: camera_active },
  { route: 'Upload', label: 'Upload', icon: upload, active: upload_active },
]

const Tab = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { resetBackground } = useAppContext()

  return (
    <View className="absolute bottom-1 w-[50%] flex-row justify-between items-center bg-[#0C1125] border-2 border-[#75DDAE] rounded-full px-10">
      {TABS.map((tab) => {
        const active = route.name === tab.route
        const icon = active? tab.active:tab.icon
        return (
          <Pressable
            key={tab.route}
            onPress={() => {
              if (!active) navigation.navigate(tab.route)
              if (tab.route === "Home") {
                resetBackground()
              }
            }}
            className={`flex-1 items-center py-2 mx-1 rounded-full `}
          >
            <img
              src={typeof tab.icon === 'string' ? icon : icon?.uri || icon?.default}
              className="h-6 w-6"
            />
            <Text className={`text-xs mt-1 ${active ? 'text-[#49C6FC] font-bold' : 'text-[#75DDAE]'}`}>
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export default Tab