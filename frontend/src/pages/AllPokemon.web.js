import { StyleSheet, Text, View, Pressable, Image, TextInput, ScrollView, ActivityIndicator, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { useNavigation } from '@react-navigation/native'
import pokeApi from '../utils/pokeApi'
import Tab from '../components/Tab'

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

const background = require('../../assets/bg9.jpg')

const getAll = async () => {
  try {
    const data = await pokeApi.get('pokemon?limit=151')
    return data.data
  } catch (err) {
    console.error("Error fetching all pokemon: ", err)
    return null
  }
}

const getPokemon = async (pokemon) => {
  try {
    const data = await pokeApi.get('pokemon/' + pokemon)
    return data.data
  }
  catch (err) {
    console.error("Error fetching pokemon: ", err)
    return null
  }
}

const AllPokemon = () => {
  const { setBackgroundImage, setBlur, setPokemonCache, pokemonCache } = useAppContext()
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()
  const [search, setSearch] = useState('')
  const [all, setAll] = useState([])

  useEffect(() => {
    if (pokemonCache) {
      setAll(pokemonCache)
      setLoading(false)
      setBackgroundImage(background)
      setBlur(10)
      return
    }
    const fetchAll = async () => {
      setLoading(true)
      setBackgroundImage(background)
      setBlur(10)
      const list = await getAll()
      const details = await Promise.all(list.results.map(async ({ name }) => {
        const d = await getPokemon(name)
        return {
          name: d.name,
          sprite: d.sprites.other['official-artwork'].front_default,
          types: d.types.map(t => t.type.name),
          id: d.id
        }
      }))

      setAll(details.filter(Boolean).sort((a, b) => a.id - b.id))
      setPokemonCache(details.filter(Boolean).sort((a, b) => a.id - b.id))
      setLoading(false)
      console.log("All Pokemon Length: ", details.length)
    }
    fetchAll()
  }, [])

  const filtered = all.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))


  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-row justify-start items-center gap-3 absolute top-0 ">
        <img src={require('../../assets/logo.png').uri} className="h-32 w-32" />
        <Text className="text-3xl font-bold text-text1">Cosmidex</Text>
      </View>

      <View className="flex-1 mt-36 mb-20 w-[70%] bg-[#0C1125] rounded-xl border border-[#75DDAE] ">
        <View className="items-center mb-2 border-b-2 border-[#75DDAE] pb-3 p-4">
          <Text className="text-[#79E7B8] text-3xl">All Pokemon</Text>
          <Text className="text-text1 mt-1">
            {all.length} Pokémon
          </Text>
          <TextInput
            className="text-text1 border-2 border-[#75DDAE] rounded-full w-full px-4 py-2 mt-3"
            placeholder="Search Pokémon..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#75DDAE80"
          />
        </View>
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#75DDAE" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(p) => p.id.toString()}
            numColumns={3}
            columnWrapperStyle={{ gap: 10, paddingHorizontal: 12 }}
            contentContainerStyle={{ gap: 10, paddingBottom: 16, paddingTop: 12 }}
            initialNumToRender={12}
            maxToRenderPerBatch={12}
            windowSize={7}
            removeClippedSubviews={true}
            renderItem={({ item: p }) => (<Pressable
              onPress={() => navigation.navigate('Pokemon', { pokemon: p.name })}
              className="flex-1 items-center bg-p1/10 rounded-lg p-2 border border-[#75DDAE] "
            >
              <Text className="text-p1 font-bold text-xs self-start">#{p.id}</Text>
              {p.sprite ? (
                <Image source={{ uri: p.sprite }} className="h-20 w-20" />
              ) : (
                <Text>?</Text>
              )}
              <Text className="text-[#79E7B8] font-bold text-xs capitalize mt-1" numberOfLines={1}>
                {p.name}
              </Text>
              <View className="flex-row flex-wrap gap-1 mt-1 justify-center">
                {p.types.map((type, i) => (
                  <View
                    key={i}
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: typeColours[type] }}
                  />
                ))}
              </View>

            </Pressable>)}
            ListEmptyComponent={
              <Text className="text-text1 text-center mt-6">No Pokémon match your search.</Text>
            }
          />
        )}

      </View>
      <Tab />

    </View>
  )
}

export default AllPokemon
