import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Pressable, ImageBackground } from 'react-native';
import CameraComponent from './components/CameraComponent';
import UploadComponent from './components/UploadComponent';
import { useState, useEffect } from "react";
import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite'
import { Asset } from 'expo-asset'
import '../global.css'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Home from './pages/Home';
import {BlurView} from 'expo-blur'
import Pokemon from './pages/Pokemon';
import NotConfident from './pages/NotConfident'

const home = require('../assets/bg7.jpg')
export default function App() {
  const [backgroundImage, setBackgroundImage] = useState(home)
  const [mode, setMode] = useState('pokemon')
  const [model, setModel] = useState(null)
  const [pokemon, setPokemon] = useState("bulbasaur")
  const [blur, setBlur] = useState(0)
  const [top5, setTop5] = useState([])
  useEffect(() => {
    async function loadModel() {
      try {
        const asset = Asset.fromModule(require('../assets/best.tflite'))
        await asset.downloadAsync()
        if (!asset.localUri) {
          console.error("Failed to load model, no local URI")
        }

        const m = await loadTensorflowModel({ url: asset.localUri }, [])
        setModel(m)
      }
      catch (e) {
        console.log("Error loading model", e)
      }
    }
    loadModel()
  }, [])
  return (
    <View className="flex-1 bg-indigo-900">
      <SafeAreaProvider>
        <ImageBackground source={backgroundImage} className="flex-1" resizeMode="cover" blurRadius={blur}>
          <SafeAreaView className="flex-1">
            {!pokemon && !mode && <Home setMode={setMode}/>}
            {!pokemon && mode=="camera" && <CameraComponent model={model} setPokemon={setPokemon} setMode={setMode} setTop5={setTop5}/>}
            {!pokemon && mode=="upload" && <UploadComponent model={model} setPokemon={setPokemon} setMode={setMode} setTop5={setTop5}/>}
            {pokemon &&mode=='pokemon' && <Pokemon pokemon={pokemon} setBlur={setBlur} setBackgroundImage={setBackgroundImage} setPokemon={setPokemon} setMode={setMode}/>}
            {mode=='notConfident' && <NotConfident top5={top5} setMode={setMode} setPokemon={setPokemon} setBackgroundImage={setBackgroundImage} setBlur={setBlur}/>}
          </SafeAreaView>
        </ImageBackground>
      </SafeAreaProvider>
    </View>
  );
}

