import React, { useState, createContext, useContext, useEffect} from 'react'
import * as tf from '@tensorflow/tfjs'
import CatchToast from '../components/CatchToast'

const AppContext = createContext(null)

const home = require('../../assets/bg7.jpg')
const TOTAL_POKEMON = 5
const CAUGHT_KEY = 'caughtPokemon'
const MEDAL_KEY = 'medalCount'

const capitalize =  (s) =>s.charAt(0).toUpperCase() + s.slice(1)

export const AppProvider = ({children}) => {
    const [backgroundImage, setBackgroundImage] = useState(home)
    const [blur, setBlur] = useState(10)
    const [model, setModel] = useState(null)
    const [pokemonCache, setPokemonCache] = useState(null)
    const [caughtPokemon, setCaughtPokemon] = useState([])
    const [medal, setMedal] = useState(0)
    const [catchMessage, setCatchMessage] = useState(null)


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

    useEffect(()=>{
        try {
            const savedCaught = window.localStorage.getItem(CAUGHT_KEY)
            const savedMedal = window.localStorage.getItem(MEDAL_KEY)
            if (savedCaught){
                setCaughtPokemon(JSON.parse(savedCaught))
            }
            if (savedMedal){
                setMedal(parseInt(savedMedal, 10) || 0)
            }
        } catch (error) {
            console.error("Error loading catch progress", error)
        }
    }, [])

    useEffect(() => {
            if (!catchMessage) return
            if (!catchMessage.isMedal){
                const t = setTimeout(()=> setCatchMessage(null), 2000)
                return ()=> clearTimeout(t)
            }
    
        }, [catchMessage])

    const resetBackground = ()=>{
        setBackgroundImage(home)
        setBlur(10)
    }
    
    const catchPokemon = (name) =>{
        const key = name.toLowerCase()

        if (caughtPokemon.includes(key)){
            setCatchMessage({text: `You already caught ${name}!`, isMedal:false})
            return
        }
        const updated = [...caughtPokemon, key]

        if (updated.length >= TOTAL_POKEMON){
            const newMedal = medal + 1
            setMedal(newMedal)
            setCaughtPokemon([])
            try {
                window.localStorage.setItem(CAUGHT_KEY, JSON.stringify([]))
                window.localStorage.setItem(MEDAL_KEY, String(newMedal))
            } catch (error) {
                console.error("Error saving medal progress", error)
            }
            setCatchMessage({
                text: `Congratulations! You caught all 151 Pokémon! Medal #${newMedal} earned! - now start over, hehehehe`,
                isMedal:true
            })
        }
        else{
            setCaughtPokemon(updated)
            try{
                window.localStorage.setItem(CAUGHT_KEY, JSON.stringify(updated))
            } catch(error){
                console.error("Error saving catch progress", error)
            }
            setCatchMessage({
                text: `Gotcha! You caught ${capitalize(key)}`,
                isMedal:false
            })
        }

    }

    
  return (
    <AppContext.Provider value={{model, backgroundImage,pokemonCache, setPokemonCache, setBackgroundImage, blur, setBlur, resetBackground, caughtPokemon, catchPokemon, medal,catchMessage}}>
        {children}
        <CatchToast/>
    </AppContext.Provider>
    
  )
}


export const useAppContext = () => useContext(AppContext)