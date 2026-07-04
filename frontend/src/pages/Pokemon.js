import { StyleSheet, Text, View, Pressable, Image, ImageBackground, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import pokeApi from '../utils/pokeApi'

const getPokemon = async (pokemon) => {
  const data = await pokeApi.get(`pokemon/${pokemon}`)
  console.log(data.data.types)
  return data.data
}
const getPokemonSpecies = async (pokemon) => {
  const data = await pokeApi.get(`pokemon-species/${pokemon}`)
  return data.data
}
const getEvolutionChain = async (url) => {
  try {
    let data = await pokeApi.get(url)
    data = data.data
    let currentStep = data.chain
    const allNames = []

    while (currentStep) {
      allNames.push(currentStep.species.name)
      currentStep = currentStep.evolves_to[0]
    }

    const allEvolutions = []
    for (let i = 0; i < allNames.length; i++) {
      const pokemonData = await getPokemon(allNames[i])
      allEvolutions.push({
        name: pokemonData.name,
        sprite: pokemonData.sprites.other['official-artwork'].front_default,
        types: pokemonData.types.map(type => type.type.name)
      })
    }
    console.log("Evolution Chain: ", allEvolutions)
    return allEvolutions
  } catch (error) {
    console.error("Error fetching evolution chain: ", error)
    return null
  }
}
const typeBackgrounds = {
  fire: require('../../assets/fire.jpg'),
  water: require('../../assets/water.jpg'),
  electric: require('../../assets/electric.jpg'),
  grass: require('../../assets/grass.jpg'),
  normal: require('../../assets/normal.jpg'),
  fighting: require('../../assets/fighting.jpeg'),
  flying: require('../../assets/flying.jpg'),
  bug: require('../../assets/bug.jpg'),
  dragon: require('../../assets/dragon.jpg'),
  ghost: require('../../assets/ghost.jpg'),
  ground: require('../../assets/ground.webp'),
  ice: require('../../assets/ice.jpg'),
  poison: require('../../assets/poison.jpg'),
  psychic: require('../../assets/psychic.jpg'),
  rock: require('../../assets/rock.png'),
  fairy: require('../../assets/fairy.jpg'),
}
const home = require('../../assets/bg7.jpg')
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

const Pokemon = ({ pokemon, setPokemon, setMode, setBackgroundImage, setBlur }) => {
  const [data, setData] = useState(null)
  const [types, setTypes] = useState([])
  const [abilities, setAbilities] = useState(null)
  const [speciesData, setSpeciesData] = useState(null)
  const [height, setHeight] = useState(null)
  const [weight, setWeight] = useState(null)
  const [stats, setStats] = useState(null)
  const [dataMode, setDataMode] = useState("info")
  const [summary, setSummary] = useState(null)
  const [evolutions, setEvolutions] = useState(null)
  const [loadingEvolutions, setLoadingEvolutions] = useState(false)
  useEffect(() => {
    setData(null)
    setSpeciesData(null)
    setStats(null)
    setEvolutions(null)
    setDataMode("info")

    const fetchPokemon = async () => {
      const pokemonData = await getPokemon(pokemon)
      const pokemonSpeciesData = await getPokemonSpecies(pokemon)
      setData(pokemonData)
      setSpeciesData(pokemonSpeciesData)
    }
    fetchPokemon()
  }
    , [pokemon])
  useEffect(() => {

    const fetchPokemon = async () => {
      const pokemonData = await getPokemon(pokemon)
      const pokemonSpeciesData = await getPokemonSpecies(pokemon)
      setData(pokemonData)
      setSpeciesData(pokemonSpeciesData)
    }
    fetchPokemon()
  }
    , [])

  useEffect(() => {
    if (data && data.types && data.types.length > 0) {
      const types = data.types.map(type => type.type.name)
      setTypes(types)
      console.log(types)
      setBackgroundImage(typeBackgrounds[types[0]])
      setBlur(20)
    }
    if (data && data.abilities && data.abilities.length > 0) {
      const ability = data.abilities.map(ability => ability.ability.name)
      setAbilities(ability[0])
      console.log("Abilities: ", ability[0])
    }

    if (data && data.height && data.weight) {
      const h = data.height / 10
      const w = data.weight / 10
      setHeight(h)
      setWeight(w)
      console.log("Height: ", h, "m")
      console.log("Weight: ", w, "kg")
    }
    if (data && data.stats && data.stats.length > 0) {
      const s = data.stats.map(stat => ({ name: stat.stat.name, value: stat.base_stat }))
      setStats(s)
      console.log("Stats: ", s)
    }
    if (speciesData && speciesData.flavor_text_entries && speciesData.flavor_text_entries.length > 0) {
      let flavorText = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')
      flavorText = flavorText.flavor_text.replace(/\n|\f/g, ' ')
      console.log("Summary: ", flavorText)
      setSummary(flavorText)
    }
  }, [data, speciesData])
  useEffect(() => {
    console.log(dataMode)

  }, [dataMode])

  const handleEvolutionsPress = async () => {
    setDataMode("evolutions")
    if (!evolutions && !loadingEvolutions && speciesData) {
      setLoadingEvolutions(true)
      const chain = await getEvolutionChain(speciesData.evolution_chain.url)
      setEvolutions(chain)
      setLoadingEvolutions(false)
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="flex-row justify-start items-center gap-3 absolute top-0 ">
        <Image source={require('../../assets/logo.png')} className="h-32 w-32" />
        <Text className="text-3xl font-bold text-text1">Cosmidex</Text>
      </View>


      {data && <View className="flex-1 mt-36 p-0 w-[90%] rounded-lg ">
        <ImageBackground resizeMode="cover" source={typeBackgrounds[types[0]]} className="rounded-lg flex-1 justify-center items-center absolute w-full h-[40%]">

          <Image source={{ uri: data.sprites.other['official-artwork'].front_default }} className="h-[250px] w-[250px]" />
        </ImageBackground>


        <View className="flex-1 items-center bg-[#0C1125] absolute w-full top-[40%] h-[60%] p-3">

          <View className="flex-row w-full justify-center items-center">
            <Text className="text-[#79E7B8]  text-4xl">{data.name.toUpperCase()}</Text>
            <Text className="text-[#79E7B8] font-bold text-3xl absolute right-0">#{data.id}</Text>
          </View>

          <View className="flex-row gap-4 w-full justify-center items-center mt-1 border-b-2 border-[#75DDAE] pb-1">
            <Pressable onPress={() => setDataMode("info")}>
              <Text className={`text-text1 p-3 pl-6 pr-6 ${dataMode == "info" ? 'bg-p1/20 border-[#75DDAE] border-2 rounded-full' : ''}`}>INFO</Text>
            </Pressable>
            <Pressable onPress={() => setDataMode("stats")}>
              <Text className={`text-text1 p-3 pl-6 pr-6 ${dataMode == "stats" ? 'bg-p1/20 border-[#75DDAE] border-2 rounded-full ' : ''}`}>STATS</Text>
            </Pressable>
            <Pressable onPress={handleEvolutionsPress}>
              <Text className={`text-text1 p-3 pl-6 pr-6 ${dataMode == "evolutions" ? 'bg-p1/20 border-[#75DDAE] border-2 rounded-full ' : ''}`}>EVOLUTIONS</Text>
            </Pressable>
          </View>
          {dataMode === "info" && <View className="flex-1 w-full mt-3 px-3">
            <View className="justify-center items-center gap-2 mb-5">
              <Text className="text-text2 text-2xl underline">SUMMARY</Text>
              <Text className="text-text1 items leading-5 text-center">{summary}</Text>
            </View>

            <View className="flex-row justify-between items-start gap-8 mb-4">
              <View className="items-start w-[50%]">
                <Text className="text-text2 text-sm font-bold tracking-widest mb-1.5">TYPE</Text>
                <View className="flex-row flex-wrap gap-2">
                  {types.map((type, index) => (
                    <Text
                      key={index}
                      className="text-white text-xs font-bold p-2 pl-3 pr-3 rounded-full"
                      style={{ backgroundColor: typeColours[type] }}
                    >
                      {type.toUpperCase()}
                    </Text>
                  ))}
                </View>
              </View>
              <View className="items-start flex-1">
                <Text className="text-text2 text-sm font-bold tracking-widest mb-1.5">ABILITY</Text>
                <Text className="text-text1 capitalize">{abilities ? abilities.replace('-', ' ') : ""}</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center border-t border-[#75DDAE]/20 pt-3">
              <View className="flex-1 items-center">
                <Text className="text-text2 text-sm font-bold tracking-widest">HEIGHT</Text>
                <Text className="text-text1 text-xl mt-0.5">{height} m</Text>
              </View>
              <View className="w-[1px] h-8 bg-[#75DDAE]/20" />
              <View className="flex-1 items-center">
                <Text className="text-text2 text-sm font-bold tracking-widest">WEIGHT</Text>
                <Text className="text-text1 text-xl mt-0.5">{weight} kg</Text>
              </View>
            </View>
          </View>}
          {dataMode === "stats" && (
            <View className="flex-1 w-full mt-3 px-2">
              <View className="justify-center items-center gap-2 mb-3">
                <Text className="text-text2 text-2xl underline">BASE STATS</Text>
              </View>

              {stats && stats.map((stat, index) => {
                const statPercent = Math.min((stat.value / 255) * 100, 100)
                const barColor = stat.value < 60 ? "#EF4444" : stat.value < 90 ? "#F59E0B" : "#10B981"
                const label =
                  stat.name === "special-attack" ? "Sp. Atk" :
                    stat.name === "special-defense" ? "Sp. Def" :
                      stat.name === "hp" ? "HP" :
                        stat.name

                return (
                  <View key={index} className="flex-row items-center w-full mb-2.5">
                    <Text className="text-text1 capitalize w-20">{label}</Text>
                    <Text className="text-text1 w-10 text-right font-bold mr-2">{stat.value}</Text>
                    <View className="flex-1 h-3 rounded-full overflow-hidden bg-white/10">
                      <View
                        className="h-full rounded-full"
                        style={{ width: `${statPercent}%`, backgroundColor: barColor }}
                      />
                    </View>
                  </View>
                )
              })}

              {stats && (
                <View className="flex-row items-center w-full mt-1 pt-2 border-t border-[#75DDAE]/30">
                  <Text className="text-text2 font-bold w-20 text-sm">TOTAL</Text>
                  <Text className="text-text2 font-bold w-10 text-right text-sm mr-2">
                    {stats.reduce((sum, s) => sum + s.value, 0)}
                  </Text>
                  <View className="flex-1" />
                </View>
              )}
            </View>
          )}

          {dataMode === "evolutions" && (
            <View className="flex-1 w-full mt-3 px-2">
              <View className="justify-center items-center gap-2 mb-3">
                <Text className="text-text2 text-2xl underline">EVOLUTION CHAIN</Text>
              </View>

              {loadingEvolutions && (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#75DDAE" />
                </View>
              )}

              {!loadingEvolutions && evolutions && evolutions.length === 1 && (
                <Text className="text-text1 text-center mt-6">This Pokémon does not evolve.</Text>
              )}

              {!loadingEvolutions && evolutions && evolutions.length > 1 && (
                <View className="flex-row flex-wrap justify-center items-center mt-2">
                  {evolutions.map((evo, index) => (
                    <View key={index} className="flex-row items-center">
                      <Pressable
                        onPress={() => evo.name !== data.name && setPokemon(evo.name)}
                        className={`items-center p-2 rounded-xl ${evo.name === data.name ? 'bg-p1/20 border-2 border-[#75DDAE]' : ''}`}
                      >
                        <Image source={{ uri: evo.sprite }} className="h-20 w-20" />
                        <Text className="text-text1 text-sm capitalize mt-1">{evo.name}</Text>
                        <View className="flex-row gap-1 mt-1">
                          {evo.types.map((type, i) => (
                            <View
                              key={i}
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: typeColours[type] }}
                            />
                          ))}
                        </View>
                      </Pressable>
                      {index < evolutions.length - 1 && (
                        <Text className="text-text1 text-2xl mx-1">→</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {!loadingEvolutions && !evolutions && (
                <Text className="text-text1 text-center mt-6">Couldn't load evolution data.</Text>
              )}
            </View>
          )}

        </View>
      </View>}


      <Pressable onPress={() => { setPokemon(null); setMode(null); setBackgroundImage(home); setBlur(0) }}
        className="bg-text1 p-3 rounded-lg mt-50 absolute bottom-5 ">
        <Text className="text-gray-800">Back</Text>
      </Pressable>
    </View>
  )
}

export default Pokemon

const styles = StyleSheet.create({})