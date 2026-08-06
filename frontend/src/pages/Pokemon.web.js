import { StyleSheet,ScrollView, Text, View, Pressable, Image, ImageBackground, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import pokeApi from '../utils/pokeApi'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAppContext } from '../contexts/AppContext'
import Tab from '../components/Tab'
import logo from '../../assets/logo.png'

const getPokemon = async (pokemon) => {
  try {
    const data = await pokeApi.get(`pokemon/${pokemon}`)
    return data.data
  } catch (error) {
    console.error("Error fetching pokemon: ", error)
    return null
  }
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
    return allEvolutions
  } catch (error) {
    console.error("Error fetching evolution chain: ", error)
    return null
  }
}

const getPokemonEncounters = async (pokemon) => {
  try {
    const data = await pokeApi.get(`pokemon/${pokemon}/encounters`)
    return data.data
  } catch (error) {
    console.error("Error fetching pokemon encounters: ", error)
    return null
  }
}

const formatLocation = (name) => {
  return name.replace(/-/g, ' ').replace(/\barea\b/gi, '').trim().split(' ').filter(Boolean).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
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
const GEN1_VERSIONS = ['red', 'blue', 'yellow']
const versionColours = {
  red: { bg: '#DC2626', text: '#FFFFFF' },
  blue: { bg: '#2563EB', text: '#FFFFFF' },
  yellow: { bg: '#FACC15', text: '#0C1125' },
}

const Pokemon = () => {
  const route = useRoute()
  const { pokemon } = route.params
  const { setBackgroundImage, setBlur, resetBackground } = useAppContext()
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
  const navigation = useNavigation()
  const [spawns, setSpawns] = useState(null)
  const [loadingSpawns, setLoadingSpawns] = useState(false)

  useEffect(() => {
    setData(null)
    setSpeciesData(null)
    setStats(null)
    setEvolutions(null)
    setDataMode("info")
    setSpawns(null)
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
    if (data && data.types && data.types.length > 0) {
      const types = data.types.map(type => type.type.name)
      setTypes(types)
      setBackgroundImage(typeBackgrounds[types[0]])
      setBlur(20)
    }
    if (data && data.abilities && data.abilities.length > 0) {
      const ability = data.abilities.map(ability => ability.ability.name)
      setAbilities(ability[0])
    }

    if (data && data.height && data.weight) {
      const h = data.height / 10
      const w = data.weight / 10
      setHeight(h)
      setWeight(w)
    }
    if (data && data.stats && data.stats.length > 0) {
      const s = data.stats.map(stat => ({ name: stat.stat.name, value: stat.base_stat }))
      setStats(s)
    }
    if (speciesData && speciesData.flavor_text_entries && speciesData.flavor_text_entries.length > 0) {
      let flavorText = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')
      flavorText = flavorText.flavor_text.replace(/\n|\f/g, ' ')
      setSummary(flavorText)
    }
  }, [data, speciesData])

  const handleEvolutionsPress = async () => {
    setDataMode("evolutions")
    if (!evolutions && !loadingEvolutions && speciesData) {
      setLoadingEvolutions(true)
      const chain = await getEvolutionChain(speciesData.evolution_chain.url)
      setEvolutions(chain)
      setLoadingEvolutions(false)
    }
  }
  const handleSpawnsPress = async () => {
    setDataMode("spawns")
    if (!spawns && !loadingSpawns) {
      setLoadingSpawns(true)
      const encountersData = await getPokemonEncounters(pokemon)
      if (encountersData && encountersData.length > 0) {
        const processed = encountersData.map(loc => {
          const versions = new Set()
          const methods = new Set()
          let minLevel = Infinity
          let maxLevel = -Infinity
          loc.version_details.forEach(vd => {
            if (!GEN1_VERSIONS.includes(vd.version.name)) return
            versions.add(vd.version.name)
            vd.encounter_details.forEach(ed => {
              methods.add(ed.method.name)
              if (ed.min_level < minLevel) minLevel = ed.min_level
              if (ed.max_level > maxLevel) maxLevel = ed.max_level
            })
          })
          return {
            location: formatLocation(loc.location_area.name),
            versions: Array.from(versions),
            methods: Array.from(methods),
            minLevel: minLevel === Infinity ? null : minLevel,
            maxLevel: maxLevel === -Infinity ? null : maxLevel
          }
        }).filter(loc => loc.versions.length > 0)
        setSpawns(processed)
      }
      else {
        setSpawns([])
      }
      setLoadingSpawns(false)
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="flex-row justify-start items-center gap-3 absolute top-0 ">
        <img src={require('../../assets/logo.png').uri} className="h-32 w-32" />
        <Text className="text-3xl font-bold text-text1">Cosmidex</Text>
      </View>


      {data && types[0] && <View className="mt-10 w-[70%] h-[65%] max-w-5xl rounded-lg overflow-hidden flex-row">
        <View className="w-[50%] justify-center items-center">
          <img src={typeBackgrounds[types[0]].uri} className="flex-1 absolute h-full w-full" />
          <Image source={{ uri: data.sprites.other['official-artwork'].front_default }} className="h-[280px] w-[280px]" />
        </View>


        <View className="flex-1 items-center py-7 px-10 gap-3 bg-[#0C1125] p-3">

          <View className="flex-row w-full justify-center items-center">
            <Text className="text-[#79E7B8]  text-4xl">{data.name.toUpperCase()}</Text>
            <Text className="text-[#79E7B8] font-bold text-3xl absolute right-0">#{data.id}</Text>
          </View>

          <View className="h-14 mt-4 border-b-2 border-[#75DDAE] pb-1">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}
            >
              <Pressable onPress={() => setDataMode("info")}>
                <Text className={`text-text1 p-3 px-5 ${dataMode == "info" ? 'bg-p1/20 border-[#75DDAE] border-2 rounded-full' : ''}`}>INFO</Text>
              </Pressable>
              <Pressable onPress={() => setDataMode("stats")}>
                <Text className={`text-text1 p-3 px-5 ${dataMode == "stats" ? 'bg-p1/20 border-[#75DDAE] border-2 rounded-full ' : ''}`}>STATS</Text>
              </Pressable>
              <Pressable onPress={handleEvolutionsPress}>
                <Text className={`text-text1 p-3 px-5 ${dataMode == "evolutions" ? 'bg-p1/20 border-[#75DDAE] border-2 rounded-full ' : ''}`}>EVOLUTIONS</Text>
              </Pressable>
              <Pressable onPress={handleSpawnsPress}>
                <Text className={`text-text1 p-3 px-5 ${dataMode == "spawns" ? 'bg-p1/20 border-[#75DDAE] border-2 rounded-full ' : ''}`}>SPAWN</Text>
              </Pressable>
            </ScrollView>
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
            <View className="flex-1 h-full w-full mt-3 px-2">
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
                        onPress={() => evo.name !== data.name && navigation.navigate('Pokemon', { pokemon: evo.name })}
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
          {dataMode === "spawns" && (
            <View className="flex-1 w-full mt-3 px-2">
              <View className="justify-center items-center gap-2 mb-3">
                <Text className="text-text2 text-2xl underline">SPAWN LOCATIONS</Text>
              </View>
              {loadingSpawns && (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#75DDAE" />
                </View>
              )}
              {!loadingSpawns && spawns && spawns.length == 0 && (
                <Text className="text-text1 text-center mt-6">This Pokémon can't be found in the wild.</Text>
              )}
              {!loadingSpawns && spawns && spawns.length > 0 && (
                <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
                  {spawns.map((spawn, index) => (
                    <View key={index} className="w-full mb-3 p-4 rounded-xl bg-white/5 border border-[#75DDAE]/20">
                      <View className="flex-row items-start gap-1.5 mb-3">
                        <Text className="text-text1 font-bold text-sm flex-1" numberOfLines={2}>
                          {spawn.location}
                        </Text>
                      </View>

                      <View className="flex-row flex-wrap gap-1.5 mb-3">
                        {spawn.versions.map((v, i) => {
                          const colours = versionColours[v] || { bg: '#75DDAE', text: '#0C1125' }
                          return (
                            <View key={i} className="flex-1">
                              <Text
                                className="text-[10px] px-2.5 py-1 rounded-full capitalize font-bold text-center"
                                style={{ backgroundColor: colours.bg, color: colours.text }}
                              >
                                {v}
                              </Text>
                            </View>
                          )
                        })}
                      </View>

                      <View className="flex-row justify-between items-center pt-2.5 border-t border-[#75DDAE]/15">
                        <Text className="text-text2 text-xs capitalize">{spawn.methods.join(', ')}</Text>
                        {spawn.minLevel != null && (
                          <Text className="text-text1 text-xs font-bold bg-white/10 px-2.5 py-1 rounded-full">
                            Lv {spawn.minLevel}–{spawn.maxLevel}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}

            </View>
          )}
        </View>
      </View>}


      <Tab />
    </View>
  )
}

export default Pokemon

const styles = StyleSheet.create({})