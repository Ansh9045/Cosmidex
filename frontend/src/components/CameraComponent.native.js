import { StyleSheet, Text, View, Button, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, useCameraPermission, useFrameOutput, usePhotoOutput, useCameraDevice } from 'react-native-vision-camera'
import {useNavigation} from '@react-navigation/native'

const POKEMONS = ['Abra', 'Aerodactyl', 'Alakazam', 'Arbok', 'Arcanine', 'Articuno', 'Beedrill', 'Bellsprout', 'Blastoise', 'Bulbasaur', 'Butterfree', 'Caterpie', 'Chansey', 'Charizard', 'Charmander', 'Charmeleon', 'Clefable', 'Clefairy', 'Cloyster', 'Cubone', 'Dewgong', 'Diglett', 'Ditto', 'Dodrio', 'Doduo', 'Dragonair', 'Dragonite', 'Dratini', 'Drowzee', 'Dugtrio', 'Eevee', 'Ekans', 'Electabuzz', 'Electrode', 'Exeggcute', 'Exeggutor', "Farfetch'd", 'Fearow', 'Flareon', 'Gastly', 'Gengar', 'Geodude', 'Gloom', 'Golbat', 'Goldeen', 'Golduck', 'Golem', 'Graveler', 'Grimer', 'Growlithe', 'Gyarados', 'Haunter', 'Hitmonchan', 'Hitmonlee', 'Horsea', 'Hypno', 'Ivysaur', 'Jigglypuff', 'Jolteon', 'Jynx', 'Kabuto', 'Kabutops', 'Kadabra', 'Kakuna', 'Kangaskhan', 'Kingler', 'Koffing', 'Krabby', 'Lapras', 'Lickitung', 'Machamp', 'Machoke', 'Machop', 'Magikarp', 'Magmar', 'Magnemite', 'Magneton', 'Mankey', 'Marowak', 'Meowth', 'Metapod', 'Mew', 'Mewtwo', 'Moltres', 'Mr. Mime', 'Muk', 'Nidoking', 'Nidoqueen', 'Nidoran♀', 'Nidoran♂', 'Nidorina', 'Nidorino', 'Ninetales', 'Oddish', 'Omanyte', 'Omastar', 'Onix', 'Paras', 'Parasect', 'Persian', 'Pidgeot', 'Pidgeotto', 'Pidgey', 'Pikachu', 'Pinsir', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Ponyta', 'Porygon', 'Primeape', 'Psyduck', 'Raichu', 'Rapidash', 'Raticate', 'Rattata', 'Rhydon', 'Rhyhorn', 'Sandshrew', 'Sandslash', 'Scyther', 'Seadra', 'Seaking', 'Seel', 'Shellder', 'Slowbro', 'Slowpoke', 'Snorlax', 'Spearow', 'Squirtle', 'Starmie', 'Staryu', 'Tangela', 'Tauros', 'Tentacool', 'Tentacruel', 'Vaporeon', 'Venomoth', 'Venonat', 'Venusaur', 'Victreebel', 'Vileplume', 'Voltorb', 'Vulpix', 'Wartortle', 'Weedle', 'Weepinbell', 'Weezing', 'Wigglytuff', 'Zapdos', 'Zubat']

import { useAppContext } from '../contexts/AppContext'

const convertIntoRGB = (data) => {
    let targetIndex = 0
    const inputBuffer = new Float32Array(224 * 224 * 3)
    for (let i = 0; i < data.length; i += 4) {
        const b = data[i]
        const g = data[i + 1]
        const r = data[i + 2]
        inputBuffer[targetIndex++] = r / 255.0
        inputBuffer[targetIndex++] = g / 255.0
        inputBuffer[targetIndex++] = b / 255.0
    }
    return inputBuffer
}

const CameraComponent = () => {
    const { hasPermission, requestPermission } = useCameraPermission()
    const device = useCameraDevice('back')
    const [prediction, setPrediction] = useState("Scanning...")
    const [takingPhoto, setTakingPhoto] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)

    const { model, catchPokemon } = useAppContext()
    const navigation = useNavigation()

    useEffect(() => {
        if (!hasPermission) {
            requestPermission()
        }
    }, [hasPermission, requestPermission])
    useEffect(()=>{
        if (hasPermission){
            setTakingPhoto(true)
        }
    },[hasPermission])

    const photoOutput = usePhotoOutput()

    async function takePhoto() {
        if (photoOutput) {
            try {
                if (model != null && device != null) {

                    const photo = await photoOutput.capturePhoto({ flashMode: 'off' }, {})
                    const image = await photo.toImageAsync()
                    const side = Math.min(image.width, image.height)
                    const x = (image.width - side) / 2
                    const y = (image.height - side) / 2
                    const cropped = await image.cropAsync(x, y, side, side)
                    setCapturedImage(cropped)

                    const resizedImage = await cropped.resizeAsync(224, 224)
                    image.dispose()
                    const rawBuffer = resizedImage.toRawPixelData()
                    const typedBuffer = new Uint8Array(rawBuffer.buffer)
                    resizedImage.dispose()
                    const inputTensor = convertIntoRGB(typedBuffer)
                    const output = model.runSync([inputTensor.buffer])
                    const probabilities = new Float32Array(output[0])
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
                    if (maxIndex != -1 && maxConfidence > 0.5) {
                        const PokemonName = POKEMONS[maxIndex] || `unknown index ${maxIndex}`
                        const predPct = maxConfidence.toFixed(2) * 100
                        setPrediction(`Prediction: ${PokemonName} with confidence ${predPct}%`)
                        catchPokemon(PokemonName)
                        navigation.navigate('Pokemon', {pokemon:PokemonName.toLowerCase()})
                    } else {
                        setPrediction("No confident prediction")
                        navigation.navigate('NotConfident', {top5: top5})
                    }
                    photo.dispose()
                    setTakingPhoto(false)
                }
            } catch (error) {
                console.error("Error taking photo ", error)
                setTakingPhoto(false)
            }
        }

    }


    if (!hasPermission) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>No Camera Permission</Text>
            </View>
        )
    }



    return (
        <View style={{ flex: 1 }}>
            
            {takingPhoto && device && (
                <View style={StyleSheet.absoluteFillObject}>
                    <Camera
                        isActive={true}
                        device={device}
                        style={StyleSheet.absoluteFill}
                        outputs={[photoOutput]}
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
