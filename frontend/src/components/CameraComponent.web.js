import { StyleSheet, Text, View, Pressable, Button } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { useAppContext } from '../contexts/AppContext'
import * as tf from '@tensorflow/tfjs'

const POKEMONS = ['Abra', 'Aerodactyl', 'Alakazam', 'Arbok', 'Arcanine', 'Articuno', 'Beedrill', 'Bellsprout', 'Blastoise', 'Bulbasaur', 'Butterfree', 'Caterpie', 'Chansey', 'Charizard', 'Charmander', 'Charmeleon', 'Clefable', 'Clefairy', 'Cloyster', 'Cubone', 'Dewgong', 'Diglett', 'Ditto', 'Dodrio', 'Doduo', 'Dragonair', 'Dragonite', 'Dratini', 'Drowzee', 'Dugtrio', 'Eevee', 'Ekans', 'Electabuzz', 'Electrode', 'Exeggcute', 'Exeggutor', "Farfetch'd", 'Fearow', 'Flareon', 'Gastly', 'Gengar', 'Geodude', 'Gloom', 'Golbat', 'Goldeen', 'Golduck', 'Golem', 'Graveler', 'Grimer', 'Growlithe', 'Gyarados', 'Haunter', 'Hitmonchan', 'Hitmonlee', 'Horsea', 'Hypno', 'Ivysaur', 'Jigglypuff', 'Jolteon', 'Jynx', 'Kabuto', 'Kabutops', 'Kadabra', 'Kakuna', 'Kangaskhan', 'Kingler', 'Koffing', 'Krabby', 'Lapras', 'Lickitung', 'Machamp', 'Machoke', 'Machop', 'Magikarp', 'Magmar', 'Magnemite', 'Magneton', 'Mankey', 'Marowak', 'Meowth', 'Metapod', 'Mew', 'Mewtwo', 'Moltres', 'Mr. Mime', 'Muk', 'Nidoking', 'Nidoqueen', 'Nidoran♀', 'Nidoran♂', 'Nidorina', 'Nidorino', 'Ninetales', 'Oddish', 'Omanyte', 'Omastar', 'Onix', 'Paras', 'Parasect', 'Persian', 'Pidgeot', 'Pidgeotto', 'Pidgey', 'Pikachu', 'Pinsir', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Ponyta', 'Porygon', 'Primeape', 'Psyduck', 'Raichu', 'Rapidash', 'Raticate', 'Rattata', 'Rhydon', 'Rhyhorn', 'Sandshrew', 'Sandslash', 'Scyther', 'Seadra', 'Seaking', 'Seel', 'Shellder', 'Slowbro', 'Slowpoke', 'Snorlax', 'Spearow', 'Squirtle', 'Starmie', 'Staryu', 'Tangela', 'Tauros', 'Tentacool', 'Tentacruel', 'Vaporeon', 'Venomoth', 'Venonat', 'Venusaur', 'Victreebel', 'Vileplume', 'Voltorb', 'Vulpix', 'Wartortle', 'Weedle', 'Weepinbell', 'Weezing', 'Wigglytuff', 'Zapdos', 'Zubat']

const preProcess = (videoFrame) => {
    const w = videoFrame.videoWidth
    const h = videoFrame.videoHeight
    const side = Math.min(w, h)
    const x = (w - side) / 2
    const y = (h - side) / 2

    const canvas = document.createElement('canvas')
    canvas.width = 224
    canvas.height = 224
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoFrame, x, y, side, side, 0, 0, 224, 224)
    return {
        tensor: tf.tidy(() => {
            return tf.browser.fromPixels(canvas)
                .toFloat()
                .div(255.0)
                .expandDims(0)
        }),
        dataUrl: canvas.toDataURL('image/jpeg'),
    }
}

const CameraComponent = () => {
    const [hasPermission, setHasPermission] = useState(null)
    const [permissionDenied, setDenied] = useState(false)
    const [prediction, setPrediction] = useState(null)
    const [takingPhoto, setTaking] = useState(false)
    const [image, setImage] = useState(null)
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const { model, catchPokemon } = useAppContext()
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const stopCamera = ()=>{
        if (streamRef.current){
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        if (videoRef.current){
            videoRef.current.srcObject = null
        }
    }

    useEffect(() => {
        let cancelled = false
        const startCamera = async () =>{
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video : {facingMode: 'environment'}
                })
                if (cancelled) {
                    stream.getTracks().forEach(t => t.stop())
                }
                streamRef.current = stream

                if (videoRef.current){
                    videoRef.current.srcObject = stream
                }
                setHasPermission(true)
                setTaking(true)
            } catch (error) {
                console.error("Error accessing camera: ", error)
                setDenied(true)
            }

        }

        if (isFocused){
            startCamera()
        }
        else{
            stopCamera()
        }
        return () => {
            cancelled = true
            stopCamera()
        }
    }, [isFocused])
    useEffect(() => {
        if (hasPermission) {
            setTaking(true)
        }
    }, [hasPermission])
    useEffect(()=>{
        if (takingPhoto&&videoRef.current && streamRef.current){
            videoRef.current.srcObject = streamRef.current
        }
    }, [takingPhoto])

    const takePhoto = async () => {
        if (!videoRef.current || !model) {
            console.log("Video or model not ready")
            return
        }
        try {
            setTaking(false)
            const { tensor: inputTensor, dataUrl } = preProcess(videoRef.current)
            let outputTensor
            try {
                outputTensor = model.execute(inputTensor)
            } catch (error) {
                outputTensor = model.executeAsync(inputTensor)
            }
            const probabilities = await outputTensor.data()
            const top5 = Array.from(probabilities)
                .map((p, i) => ({
                    name: POKEMONS[i],
                    prob: p,
                }))
                .sort((a, b) => b.prob - a.prob)
                .slice(0, 5)

            let maxConfidence = 0
            let maxIndex = -1
            for (let i = 0; i < probabilities.length; i++) {
                if (probabilities[i] > maxConfidence) {
                    maxConfidence = probabilities[i]
                    maxIndex = i
                }
            }
            if (maxIndex != -1 && maxConfidence > 0.4) {
                const PokemonName = POKEMONS[maxIndex] || `unknown index ${maxIndex}`
                const predPct = maxConfidence.toFixed(2) * 100
                setPrediction(`Prediction: ${PokemonName} with confidence ${predPct}%`)
                catchPokemon(PokemonName)
                navigation.navigate('Pokemon', { pokemon: PokemonName.toLowerCase() })
            } else {
                setPrediction("No confident prediction")
                navigation.navigate('NotConfident', { top5: top5 })
            }

        } catch (error) {
            console.error("Error loading Image: ", error)
            setTaking(true)
        }
    }
    if (permissionDenied) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>No Camera Permissions</Text>
            </View>
        )
    }


    return (
        <View className="flex-1">
            {takingPhoto && (
                <View style={StyleSheet.absoluteFillObject}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />

                    <View className="absolute bottom-52 self-center">
                        <Button
                            title="Click Picture"
                            onPress={() => {
                                takePhoto()
                            }}
                        />
                    </View>
                </View>
            )}

            <Pressable onPress={() => navigation.goBack()} className="absolute bottom-10 bg-p2 color-text1 p-4 rounded-lg text-3xl">
                <Text>Back</Text>
            </Pressable>
        </View>
    )
}

export default CameraComponent

const styles = StyleSheet.create({})