import {View, ImageBackground} from 'react-native'
import '../global.css'

import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import {AppProvider, useAppContext} from './contexts/AppContext'

import Home from './pages/Home'
import CameraComponent from './components/CameraComponent'
import UploadComponent from './components/UploadComponent'
import Pokemon from './pages/Pokemon'
import NotConfident from './pages/NotConfident'
import AllPokemon from './pages/AllPokemon'
import AppBackground from './components/AppBackground'

const Stack = createNativeStackNavigator()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  }
}

const AppShell = ()=>{
  const {backgroundImage, blur} = useAppContext()

  return(
    <View className="flex-1 bg-indigo-900 min-h-screen">
      <AppBackground source={backgroundImage} resizeMode="cover" className="flex-1" blurRadius={blur}>
        <SafeAreaView className="flex-1">
          <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{headerShown:false, animation:'fade',contentStyle:{backgroundColor:'transparent'}}}>
              <Stack.Screen name="Home" component={Home}/>
              <Stack.Screen name="Pokemon" component={Pokemon}/>
              <Stack.Screen name="All" component={AllPokemon}/>
              <Stack.Screen name="Camera" component={CameraComponent}/>
              <Stack.Screen name="Upload" component={UploadComponent}/>
              <Stack.Screen name="NotConfident" component={NotConfident}/>
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
        
      </AppBackground>
    </View>
  )
}

const App=()=>{
  return(
    <SafeAreaProvider>
      <AppProvider>
        <AppShell/>
      </AppProvider>
    </SafeAreaProvider>
  )
}

export default App