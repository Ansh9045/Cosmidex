import React, { useState, createContext, useContext, useEffect} from 'react'
import * as tf from '@tensorflow/tfjs'

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
                await tf.ready()
                const m = await tf.loadGraphModel('/model/model.json')
                setModel(m)
                console.log("Web model loaded successfully")
            }
            catch(e){
                console.error("Error Loading web model", e)
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