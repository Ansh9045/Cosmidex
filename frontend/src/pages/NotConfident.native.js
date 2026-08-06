import { StyleSheet, Text, View, Pressable, Image, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import pokeApi from '../utils/pokeApi'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import Tab from '../components/Tab';

const typeColours = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};
const background = require('../../assets/bg1.jpg')

const getPokemon = async (pokemon) => {
    const data = await pokeApi.get(`pokemon/${pokemon}`)
    console.log(data.data.types)
    return data.data
}

const NotConfident = ({ setPokemon}) => {
    const navigation = useNavigation()
    const route = useRoute()
    const {top5} = route.params
    const {setBackgroundImage, setBlur, resetBackground, catchPokemon} = useAppContext()

    const [pokemonDetails, setPokemonDetails] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true)
            const result = await Promise.all(
                top5.map(async ({ name, prob }) => {
                    try {
                        const d = await getPokemon(name)
                        return {
                            name: d.name,
                            displayName: name,
                            prob: prob,
                            sprite: d.sprites.other['official-artwork'].front_default,
                            types: d.types.map(t => t.type.name)
                        }
                    } catch (err) {
                        console.error("Error fetching pokemon details: ", err)
                        return { name: name.toLowerCase(), displayName: name, prob, sprite: null, types: [] }
                    }

                })
            )
            console.log("Fetched pokemon details: ", result)
            setPokemonDetails(result)
            setLoading(false)
            setBackgroundImage(background)
            setBlur(10)


        }
        fetchAll()
    }, [])


    return (
        <View className="flex-1 justify-center items-center">
            <View className="flex-row justify-start items-center gap-3 absolute top-0">
                <Image source={require('../../assets/logo.png')} className="h-32 w-32" />
                <Text className="text-3xl text-text1 font-bold">Cosmidex</Text>
            </View>

            <View className="flex-1 mt-36 mb-20 w-[90%] bg-[#0C1125] round">
                <View className="items-center mb-4 border-b-2 border-red-500 pb-3 p-4">
                    <Text className="text-red-500 text-3xl">LOW CONFIDENCE</Text>
                    <Text className="text-text1 mt-1 text-sm text-center">
                        No Clear Match Found. Did you mean any of these?
                    </Text>
                </View>

                {loading ? <View>
                    <ActivityIndicator size="large" color="#75DDAE" />
                </View> : <View className="flex-1 gap-3 px-4 mt-3">
                    {pokemonDetails.map((p, index) => (
                        <Pressable key={index}
                            onPress={() => {
                                catchPokemon(p.name)
                                navigation.navigate('Pokemon', {pokemon: p.name})
                            }}
                            className="flex-row items-center bg-p1/10 rounded-lg p-3 border border-[#75DDAE] gap-3"
                        >
                            <Text className='text-p1 font-bold'>{index + 1}</Text>
                            {p.sprite ?
                                <Image source={{ uri: p.sprite }} className="h-16 w-16 ml-3" />
                                : (
                                    <View className="h-16 w-16 ml-3 bg-p1/20 justify-center items-center rounded-lg">
                                        <Text>?</Text>
                                    </View>)}
                            <View className="flex-1 ml-4">
                                <Text className="text-[#79E7B8] font-bold text-lg">{p.displayName}</Text>
                                <View className="flex-row flex-wrap gap-1 mt-1">
                                    {p.types.map((type, i) => (
                                        <Text
                                            key={i}
                                            className="text-white text-xs font-bold px-2 py-1 rounded-full"
                                            style={{ backgroundColor: typeColours[type] }}
                                        >
                                            {type.toUpperCase()}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-text2 text-xs font-bold tracking-widest">CONF.</Text>
                                <Text className="text-text1 font-bold text-base">
                                    {(p.prob * 100).toFixed(1)}%
                                </Text>
                                <View className="w-16 h-1.5 rounded-full overflow-hidden bg-white/10 mt-1">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${Math.min(p.prob * 100, 100)}%`,
                                            backgroundColor: p.prob > 0.15 ? '#F59E0B' : '#EF4444'
                                        }}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>}



            </View>
            <Tab/>
        </View>
    )
}

export default NotConfident

const styles = StyleSheet.create({})