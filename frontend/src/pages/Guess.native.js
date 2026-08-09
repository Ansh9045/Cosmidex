import { StyleSheet, Text, View, Image, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAppContext } from '../contexts/AppContext'
import pokeApi from '../utils/pokeApi'
import { createAudioPlayer } from 'expo-audio'

const getAll = async () => {
    try {
        const data = await pokeApi.get('pokemon?limit=151')
        return data.data
    } catch (error) {
        console.error("Error fetching all pokemon: ", error)
        return null
    }
}

const getPokemon = async (pokemon) => {
    try {
        const data = await pokeApi.get('pokemon/' + pokemon)
        return data.data
    } catch (error) {
        console.error("Error fetching pokemon: ", error)
        return null
    }
}

const Guess = () => {
    const [loading, setLoading] = useState(true)
    const [all, setAll] = useState([])
    const [guess, setGuess] = useState('')
    const [current, setCurrent] = useState(null)
    const [feedback, setFeedback] = useState(null)
    const [revealed, setRevealed] = useState(false)
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(0)
    const { pokemonCache, setPokemonCache, catchPokemon, audioMuted, toggleAudio } = useAppContext()
    const navigation = useNavigation()
    const inputRef = useRef(null)
    const playerRef = useRef(null)
    const subscriptionRef = useRef(null)

    const pickRandom = (arr) => {
        if (!arr || !arr.length) return null
        const next = arr[Math.floor(Math.random() * arr.length)]
        setCurrent(next)
        setGuess('')
        setFeedback(null)
        setRevealed(false)
        console.log("Next Pokémon: ", next.name)
    }

    useEffect(() => {
        const load = async () => {
            if (pokemonCache) {
                setAll(pokemonCache)
                setLoading(false)
                pickRandom(pokemonCache)
                return
            }
            setLoading(true)
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
            const sorted = details.filter(Boolean).sort((a, b) => a.id - b.id)
            setAll(sorted)
            setPokemonCache(sorted)
            setLoading(false)
            pickRandom(sorted)
        }
        load()
    }, [])

    useEffect(() => {
        let cancelled = false

        const loadnCry = async () => {
            if (!current || audioMuted) return
            if (playerRef.current) {
                if (subscriptionRef.current) {
                    subscriptionRef.current.remove()
                }
                playerRef.current.remove()
                playerRef.current = null
                subscriptionRef.current = null
            }
            const d = await getPokemon(current.name)

            if (cancelled || !d || !d.cries) return

            const cryUrl = d.cries.latest || d.cries.legacy
            if (!cryUrl) return

            const player = createAudioPlayer(cryUrl)
            if (cancelled) {
                player.remove()
                return
            }
            playerRef.current = player
            subscriptionRef.current = player.addListener('playbackStatusUpdate', (status) => {
                if (status.didJustFinish) {
                    player.remove()
                    if (playerRef.current === player) {
                        playerRef.current = null
                        subscriptionRef.current = null
                    }
                }
            })
            player.play()
        }
        loadnCry()

        return () => {
            cancelled = true
            if (playerRef.current) {
                if (subscriptionRef.current) {
                    subscriptionRef.current.remove()
                }
                playerRef.current.remove()
                playerRef.current = null
                subscriptionRef.current = null
            }
        }
    }, [current, audioMuted])

    const handleGuess = () => {
        if (!current || !guess.trim()) return
        const isCorrect = guess.trim().toLowerCase() === current.name.toLowerCase()
        if (isCorrect) {
            setRevealed(true)
            setFeedback({
                text: `Correct! It's ${current.name.charAt(0).toUpperCase() + current.name.slice(1)}!`,
                correct: true
            })
            setScore(score + 1)
            setStreak(streak + 1)
            catchPokemon(current.name)
        }
        else {
            setFeedback({
                text: `Incorrect! It's ${current.name.charAt(0).toUpperCase() + current.name.slice(1)}!`,
                correct: false
            })
            setRevealed(true)
            setStreak(0)
        }
    }
    const handleSkip = () => {
        setStreak(0)
        pickRandom(all)
    }
    const handleNext = () => {
        pickRandom(all)
    }

    if (loading || !current) {
        return (
            <View className="flex-1 items-center justify-center bg-[#0C1125]">
                <ActivityIndicator size="large" color="#75DDAE" />
            </View>
        )
    }

    return (
        <View className="flex-1 items-center justify-center bg-[#0C1125] px-6">
            <Text className='text-3xl text-text1 font-bold'>Guess the Pokémon!</Text>
            <View className="flex-row gap-4 mb-6">
                <Text className="text-sky-500">Score: {score}</Text>
                <Text className="text-amber-400">Streak: {streak}</Text>
            </View>
            <Pressable onPress={toggleAudio} className="mb-4 px-4 py-1.5 rounded-full border border-[#75DDAE] bg-p1/10">
                <Text className="text-[#79E7B8] text-sm font-semibold">
                    {audioMuted ? "🔇 Cries Off" : "🔊 Cries On"}
                </Text>
            </Pressable>
            <View className="w-56 h-56 items-center justify-center mb-6">
                {current.sprite && (
                    <Image source={{ uri: current.sprite }} className="h-full w-full" tintColor={revealed ? undefined : "#000000"} />
                )}
            </View>

            {feedback && (
                <Text className={`text-center mb-4 ${feedback.correct ? 'text-[#79E7B8]' : 'text-[#EF4444]'}`}>
                    {feedback.text}
                </Text>
            )}

            {!revealed ? (
                <>
                    <TextInput
                        ref={inputRef}
                        value={guess}
                        onChangeText={setGuess}
                        placeholder="Who's that Pokémon?"
                        placeholderTextColor="#75DDAE80"
                        autoCapitalize='none'
                        autoCorrect={false}
                        className="text-text1 border-2 border-[#75DDAE] rounded-full w-full px-10 py-2 text-center"
                    />
                    <View className="flex-row justify-center gap-4 mt-4">
                        <Pressable onPress={handleGuess} className="px-6 py-2.5 rounded-full bg-p1/20 border-2 border-[#75DDAE]">
                            <Text className="text-[#79E7B8] font-bold">Guess!</Text>
                        </Pressable>
                        <Pressable onPress={handleSkip} className="px-6 py-2.5 rounded-full bg-p1/20 border-2 border-[#75DDAE]">
                            <Text className="text-text1">Skip</Text>
                        </Pressable>
                    </View>
                </>
            ) : (
                <Pressable onPress={handleNext} className="px-8 py-3 rounded-full bg-p1/20 border-2 border-[#75DDAE] mt-2">
                    <Text className="text-[#79E7B8] font-bold">Next Pokémon</Text>
                </Pressable>
            )}
            <Pressable onPress={() => navigation.goBack()} className="px-6 py-2.5 rounded-full bg-text1 absolute bottom-10 mt-4">
                <Text className="">Back</Text>
            </Pressable>
        </View>
    )
}

export default Guess

const styles = StyleSheet.create({})