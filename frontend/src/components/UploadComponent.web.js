import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as tf from '@tensorflow/tfjs'
import { useAppContext } from '../contexts/AppContext'
import { useNavigation } from '@react-navigation/native'
import Tab from './Tab'

const POKEMONS = ['Abra', 'Aerodactyl', 'Alakazam', 'Arbok', 'Arcanine', 'Articuno', 'Beedrill', 'Bellsprout', 'Blastoise', 'Bulbasaur', 'Butterfree', 'Caterpie', 'Chansey', 'Charizard', 'Charmander', 'Charmeleon', 'Clefable', 'Clefairy', 'Cloyster', 'Cubone', 'Dewgong', 'Diglett', 'Ditto', 'Dodrio', 'Doduo', 'Dragonair', 'Dragonite', 'Dratini', 'Drowzee', 'Dugtrio', 'Eevee', 'Ekans', 'Electabuzz', 'Electrode', 'Exeggcute', 'Exeggutor', "Farfetch'd", 'Fearow', 'Flareon', 'Gastly', 'Gengar', 'Geodude', 'Gloom', 'Golbat', 'Goldeen', 'Golduck', 'Golem', 'Graveler', 'Grimer', 'Growlithe', 'Gyarados', 'Haunter', 'Hitmonchan', 'Hitmonlee', 'Horsea', 'Hypno', 'Ivysaur', 'Jigglypuff', 'Jolteon', 'Jynx', 'Kabuto', 'Kabutops', 'Kadabra', 'Kakuna', 'Kangaskhan', 'Kingler', 'Koffing', 'Krabby', 'Lapras', 'Lickitung', 'Machamp', 'Machoke', 'Machop', 'Magikarp', 'Magmar', 'Magnemite', 'Magneton', 'Mankey', 'Marowak', 'Meowth', 'Metapod', 'Mew', 'Mewtwo', 'Moltres', 'Mr. Mime', 'Muk', 'Nidoking', 'Nidoqueen', 'Nidoran♀', 'Nidoran♂', 'Nidorina', 'Nidorino', 'Ninetales', 'Oddish', 'Omanyte', 'Omastar', 'Onix', 'Paras', 'Parasect', 'Persian', 'Pidgeot', 'Pidgeotto', 'Pidgey', 'Pikachu', 'Pinsir', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Ponyta', 'Porygon', 'Primeape', 'Psyduck', 'Raichu', 'Rapidash', 'Raticate', 'Rattata', 'Rhydon', 'Rhyhorn', 'Sandshrew', 'Sandslash', 'Scyther', 'Seadra', 'Seaking', 'Seel', 'Shellder', 'Slowbro', 'Slowpoke', 'Snorlax', 'Spearow', 'Squirtle', 'Starmie', 'Staryu', 'Tangela', 'Tauros', 'Tentacool', 'Tentacruel', 'Vaporeon', 'Venomoth', 'Venonat', 'Venusaur', 'Victreebel', 'Vileplume', 'Voltorb', 'Vulpix', 'Wartortle', 'Weedle', 'Weepinbell', 'Weezing', 'Wigglytuff', 'Zapdos', 'Zubat']

const preProcess = (img) => {
    const w = img.width
    const h = img.height
    const side = Math.min(w, h)
    const x = (w - side) / 2
    const y = (h - side) / 2

    const canvas = document.createElement('canvas')
    canvas.width = 224
    canvas.height = 224
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, x, y, side, side, 0, 0, 224, 224)
    return tf.tidy(() => {
        return tf.browser.fromPixels(canvas).toFloat().div(255.0).expandDims(0)
    })
}

const UploadComponent = () => {
    const [image, setImage] = useState(null)
    const [prediction, setPrediction] = useState(null)
    const { model } = useAppContext()
    const navigation = useNavigation()


    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permissionResult.granted) {
            Alert.alert("Permission to access media library is required!")
            return
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
        if (result.canceled || !result.assets || result.assets.length === 0) {
            console.log("No image selected")
            return
        }
        try {
            const uri = result.assets[0].uri
            setImage(uri)
            if (!model) {
                console.log("Model not loaded yet")
            }
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            img.src = uri
            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })

            const inputTensor = preProcess(img)
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

            console.log(top5)
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
                console.log(`Prediction: ${PokemonName} with confidence ${predPct}%`)
                navigation.navigate('Pokemon', { pokemon: PokemonName.toLowerCase() })
            } else {
                console.log("Max confidence: ", maxConfidence)
                console.log("Max index: ", maxIndex)
                console.log("predicted pokemon: ", POKEMONS[maxIndex])
                setPrediction("No confident prediction")
                navigation.navigate('NotConfident', { top5: top5 })
                console.log("No confident prediction")
            }
        } catch (error) {
            console.log("Error loading image: ", error)
        }
    }
    useEffect(() => {
        pickImage()
    }, [])

    return (
        <View className="flex-1 items-center justify-center">
            <Button title={image ? "Choose another Image" : "Choose an image"} onPress={pickImage} />
            {image && <img source={{ uri: image }} className="h-[200px] w-[200px]" />}
            {prediction && <Text className="text-text1">{prediction}</Text>}
            <Tab />
        </View>
    )
}

export default UploadComponent

const styles = StyleSheet.create({})