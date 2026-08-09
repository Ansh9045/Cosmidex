import React, { useState, createContext, useContext, useEffect } from 'react'
import { Asset } from 'expo-asset'
import { loadTensorflowModel } from 'react-native-fast-tflite'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CatchToast from '../components/CatchToast'

const AppContext = createContext(null)

const home = require('../../assets/bg7.jpg')
const TOTAL_POKEMON = 151
const CAUGHT_KEY = 'caughtPokemon'
const MEDAL_KEY = 'medalCount'

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const AppProvider = ({ children }) => {
    const [backgroundImage, setBackgroundImage] = useState(home)
    const [blur, setBlur] = useState(10)
    const [model, setModel] = useState(null)
    const [pokemonCache, setPokemonCache] = useState(null)
    const [caughtPokemon, setCaughtPokemon] = useState([])
    const [medal, setMedal] = useState(0)
    const [catchMessage, setCatchMessage] = useState('')
    const [audioMuted, setAudioMuted] = useState(false)
    const [isShiny, setIsShiny] = useState(false)


    useEffect(() => {
        const loadModel = async () => {
            try {
                const asset = Asset.fromModule(require('../../assets/best.tflite'))
                await asset.downloadAsync()
                if (!asset.localUri) {
                    console.error("Failed to load model, no local URI")
                }
                const m = await loadTensorflowModel({ url: asset.localUri }, [])
                setModel(m)
            }
            catch (e) {
                console.error("Error Loading model", e)
            }
        }
        loadModel()
    }, [])

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const savedCaught = await AsyncStorage.getItem(CAUGHT_KEY)
                const savedMedal = await AsyncStorage.getItem(MEDAL_KEY)
                if (savedCaught) {
                    setCaughtPokemon(JSON.parse(savedCaught))
                }
                if (savedMedal) {
                    setMedal(parseInt(savedMedal, 10) || 0)
                }
            } catch (error) {
                console.error("Error loading progress", error)
            }
        }
        loadProgress()
    }, [])

    useEffect(() => {
        if (!catchMessage) return
        if (!catchMessage.isMedal){
            const t = setTimeout(()=> setCatchMessage(null), 2000)
            return ()=> clearTimeout(t)
        }

    }, [catchMessage])


    const resetBackground = () => {
        setBackgroundImage(home)
        setBlur(10)
    }
    const toggleAudio = () => {
        setAudioMuted(!audioMuted)
    }
    const toggleShiny = () => {
        setIsShiny(!isShiny)
    }

    const catchPokemon = (name) =>{
        const key = name.toLowerCase()

        if (caughtPokemon.includes(key)){
            setCatchMessage({
                text: `You already caught ${capitalize(name)}`,
                isMedal:false
            })
            return
        }
        const updated = [...caughtPokemon, key]
        if (updated.length >=TOTAL_POKEMON){
            const newMedal = medal + 1
            setMedal(newMedal)
            setCaughtPokemon([])
            try {
                AsyncStorage.setItem(CAUGHT_KEY, JSON.stringify([]))
                AsyncStorage.setItem(MEDAL_KEY, String(newMedal))
            } catch (error) {
                console.error("Error saving progress", error)
            }

            setCatchMessage({
                text: `Congratulations! You caught all 151 Pokémon! Medal #${newMedal} earned! - now start over, hehehehe`,
                isMedal:true
            })
        }
        else{
            setCaughtPokemon(updated)
            try{
                AsyncStorage.setItem(CAUGHT_KEY, JSON.stringify(updated))
            } catch (error) {
                console.error("Error saving catch progress", error)
            }
            setCatchMessage({
                text: `Gotcha! You caught ${capitalize(key)}`,
                isMedal:false
            })
        }
    }

    return (
        <AppContext.Provider value={{ model, backgroundImage, pokemonCache, setPokemonCache, setBackgroundImage, blur, setBlur, resetBackground, caughtPokemon, medal, catchPokemon, catchMessage, audioMuted, toggleAudio, isShiny, toggleShiny }}>
            {children}
            <CatchToast />
        </AppContext.Provider>

    )
}


export const useAppContext = () => useContext(AppContext)