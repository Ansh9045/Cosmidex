import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import {useAppContext} from '../contexts/AppContext'

const Medal = () => {
  const {catchMessage} = useAppContext()
  const [isActive, setIsActive] = useState(false)

  useEffect(()=>{
    if (catchMessage && catchMessage.isMedal){
      setIsActive(true)
    }
  }, [catchMessage])

  if (!catchMessage || !catchMessage.isMedal) return null

  if (!isActive) return null

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-[#0C1125]/95 flex items-center justify-center z-50 p-4 gap-10">
      <Text className="text-3xl font-bold text-text2">CONGRATULATIONS!!!</Text>
      <img src={require('../../assets/medal.png').uri} className="w-40 h-40"/>
      <Text className="text-text1 p-5 text-xl text-center">{catchMessage.text}</Text>
      <Pressable className="absolute bottom-20 border-2 border-[#FFD700] rounded-full w-16 h-16 p-3 items-center justify-center" onPress={()=> setIsActive(false)}>
        <Text className="text-[#FFD700] text-3xl">X</Text>
      </Pressable>
    </View>
  )
}

export default Medal

const styles = StyleSheet.create({})