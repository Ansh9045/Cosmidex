import { StyleSheet, Text, Pressable, View, Image } from 'react-native'
import React from 'react'
import { Shadow } from 'react-native-shadow-2'

const Home = ({ setMode }) => {
    return (
        <View className="flex-1 items-center justify-center gap-5">
            <View className="flex-1 justify-center items-center">
                <View className="flex-row justify-start items-center gap-3">
                <Image source={require('../../assets/logo.png')} className="h-32 w-32" />
                <Text className="text-3xl font-bold text-text1">Cosmidex</Text>
                </View>
                <Image source={require('../../assets/icon.png')} className="absolute top-[145px]" />

            </View>

            <View className="flex-1 flex-row justify-center items-center gap-3 w-[90%] mt-32">
                <Pressable className="border-4 rounded-3xl border-p2 p-5 flex-1 justify-center items-center bg-p2/20" onPress={() => setMode('camera')} >
                    <Image source={require('../../assets/camera.png')} className="h-20 w-20" />
                    <Text className='text-p2 text-xl font-bold'>Use Camera</Text>
                </Pressable>
                <Pressable className="border-4 rounded-3xl border-p1 p-5 flex-1 justify-center items-center bg-p1/20" onPress={() => setMode('upload')} >
                    <Image source={require('../../assets/gallery.png')} className="h-20 w-20" />
                    <Text className='text-p1 text-xl'>Upload Image</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})