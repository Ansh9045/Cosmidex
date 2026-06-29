import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Alert, View, Button, Text, StyleSheet, Pressable } from 'react-native'
import { loadImage, NitroImage } from 'react-native-nitro-image'


const POKEMONS = ['Abra', 'Aerodactyl', 'Alakazam', 'Arbok', 'Arcanine', 'Articuno', 'Beedrill', 'Bellsprout', 'Blastoise', 'Bulbasaur', 'Butterfree', 'Caterpie', 'Chansey', 'Charizard', 'Charmander', 'Charmeleon', 'Clefable', 'Clefairy', 'Cloyster', 'Cubone', 'Dewgong', 'Diglett', 'Ditto', 'Dodrio', 'Doduo', 'Dragonair', 'Dragonite', 'Dratini', 'Drowzee', 'Dugtrio', 'Eevee', 'Ekans', 'Electabuzz', 'Electrode', 'Exeggcute', 'Exeggutor', "Farfetch'd", 'Fearow', 'Flareon', 'Gastly', 'Gengar', 'Geodude', 'Gloom', 'Golbat', 'Goldeen', 'Golduck', 'Golem', 'Graveler', 'Grimer', 'Growlithe', 'Gyarados', 'Haunter', 'Hitmonchan', 'Hitmonlee', 'Horsea', 'Hypno', 'Ivysaur', 'Jigglypuff', 'Jolteon', 'Jynx', 'Kabuto', 'Kabutops', 'Kadabra', 'Kakuna', 'Kangaskhan', 'Kingler', 'Koffing', 'Krabby', 'Lapras', 'Lickitung', 'Machamp', 'Machoke', 'Machop', 'Magikarp', 'Magmar', 'Magnemite', 'Magneton', 'Mankey', 'Marowak', 'Meowth', 'Metapod', 'Mew', 'Mewtwo', 'Moltres', 'Mr. Mime', 'Muk', 'Nidoking', 'Nidoqueen', 'Nidoran♀', 'Nidoran♂', 'Nidorina', 'Nidorino', 'Ninetales', 'Oddish', 'Omanyte', 'Omastar', 'Onix', 'Paras', 'Parasect', 'Persian', 'Pidgeot', 'Pidgeotto', 'Pidgey', 'Pikachu', 'Pinsir', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Ponyta', 'Porygon', 'Primeape', 'Psyduck', 'Raichu', 'Rapidash', 'Raticate', 'Rattata', 'Rhydon', 'Rhyhorn', 'Sandshrew', 'Sandslash', 'Scyther', 'Seadra', 'Seaking', 'Seel', 'Shellder', 'Slowbro', 'Slowpoke', 'Snorlax', 'Spearow', 'Squirtle', 'Starmie', 'Staryu', 'Tangela', 'Tauros', 'Tentacool', 'Tentacruel', 'Vaporeon', 'Venomoth', 'Venonat', 'Venusaur', 'Victreebel', 'Vileplume', 'Voltorb', 'Vulpix', 'Wartortle', 'Weedle', 'Weepinbell', 'Weezing', 'Wigglytuff', 'Zapdos', 'Zubat']

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


export default function UploadComponent({model, setMode, setPokemon}) {
    const [image, setImage] = useState(null)
    const [prediction, setPrediction] = useState(null)
    
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permissionResult.granted) {
            Alert.alert("Permission to access camera roll is required!")
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
            const img = await loadImage({ url: result.assets[0].uri })

            console.log(result.assets[0].uri)
            if (img) {
                const side = Math.min(img.width, img.height)
                const x = (img.width - side) / 2
                const y = (img.height - side) / 2
                const cropped = await img.cropAsync(x, y, side, side)
                console.log("Cropped image size: ", cropped.width, cropped.height)
                setImage(cropped)
                const resizedImage = await cropped.resizeAsync(224, 224)
                const rawBuffer = await resizedImage.toRawPixelData()
                const typedBuffer = new Uint8Array(rawBuffer.buffer)
                const inputTensor = convertIntoRGB(typedBuffer)
                if (model != null) {
                    try {
                        const output = model.runSync([inputTensor.buffer])
                        const probabilities = new Float32Array(output[0])
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
                            setPokemon(PokemonName)
                        } else {
                            console.log("Max confidence: ", maxConfidence)
                            console.log("Max index: ", maxIndex)
                            console.log("predicted pokemon: ", POKEMONS[maxIndex])
                            setPrediction("No confident prediction")
                            console.log("No confident prediction")
                        }
                    } catch (error) {
                        console.log("Error running model: ", error)
                    }

                }
            }
        } catch (e) {
            console.error("Error loading image:", e)
        }




    }
    return (
        <View style={styles.container}>
            <Button title={image? "Choose another Image":"Choose an image"} onPress={pickImage} />
            {image && <NitroImage style={styles.image} image={image} />}
            {prediction && <Text style={styles.prediction}>{prediction}</Text>}
            <Pressable onPress={()=>setMode(null)} className="absolute bottom-10 bg-p2 color-text1 p-4 rounded-lg text-3xl">
                <Text>Back</Text>
            </Pressable>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
    prediction:{
        color: 'black'
    }
});