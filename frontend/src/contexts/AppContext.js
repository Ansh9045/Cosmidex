import React, { useState, createContext, useContext, useEffect} from 'react'
import { Asset } from 'expo-asset'
import {loadTensorflowModel} from 'react-native-fast-tflite'

const AppContext = createContext(null)

const home = require('../../assets/bg7.jpg')

export const AppProvider = ({children}) => {
    const [backgroundImage, setBackgroundImage] = useState(home)
    const [blur, setBlur] = useState(10)
    const [model, setModel] = useState(null)
    const [pokemonCache, setPokemonCache] = useState(null)

    useEffect(()=>{
        const loadModel = async()=>{
            try{
                const asset = Asset.fromModule(require('../../assets/best.tflite'))
                await asset.downloadAsync()
                if (!asset.localUri){
                    console.error("Failed to load model, no local URI")
                }
                const m = await loadTensorflowModel({url:asset.localUri},[])
                setModel(m)
            }
            catch(e){
                console.error("Error Loading model", e)
            }
        }
        loadModel()
    }, [])

    const resetBackground = ()=>{
        setBackgroundImage(home)
        setBlur(10)
    }

    
  return (
    <AppContext.Provider value={{model, backgroundImage,pokemonCache, setPokemonCache, setBackgroundImage, blur, setBlur, resetBackground}}>
        {children}
    </AppContext.Provider>
    
  )
}


export const useAppContext = () => useContext(AppContext)