import { StyleSheet, Text, Pressable, View, Image, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Tab from '../components/Tab'

const Home = () => {

    console.log("Rendering Home")
    const navigation = useNavigation()
    return (
        <View className="flex-1 items-center justify-center">
            <View className="flex-row justify-start items-center gap-3 absolute top-3">
                <Image source={require('../../assets/logo.png')} className="h-32 w-32" />
                <Text className="text-3xl font-bold text-text1">Cosmidex</Text>
            </View>

            <View className="mt-32 mb-20 w-[90%] max-h-[70%] bg-[#0C1125] rounded-xl border border-[#75DDAE] flex-1 overflow-hidden">
                <ImageBackground source={require('../../assets/bg7.jpg')}>

                    <View className="w-full  items-center justify-center border-r pt-20 border-[#75DDAE]/30 py-8 px-6">


                        <View className="items-center justify-center relative h-32 w-32 mb-4">
                            <View className="absolute h-full w-full rounded-full bg-p1/10" />
                            <View className="h-24 w-24 rounded-full border-2 border-[#75DDAE] items-center justify-center">
                                <Image source={require('../../assets/icon.png')} className="h-28 w-28" />
                            </View>
                            <View className="absolute top-0 left-0 h-5 w-5 border-t-4 border-l-4 border-[#75DDAE] rounded-tl-lg" />
                            <View className="absolute top-0 right-0 h-5 w-5 border-t-4 border-r-4 border-[#75DDAE] rounded-tr-lg" />
                            <View className="absolute bottom-0 left-0 h-5 w-5 border-b-4 border-l-4 border-[#75DDAE] rounded-bl-lg" />
                            <View className="absolute bottom-0 right-0 h-5 w-5 border-b-4 border-r-4 border-[#75DDAE] rounded-br-lg" />
                        </View>
                        <Text className="text-[#79E7B8] text-xl font-bold text-center">Welcome, Trainer</Text>
                        <Text className="text-text2 text-xs mt-1 text-center">
                            Scan, search, and explore
                        </Text>
                    </View>
                </ImageBackground>

                <View className="flex-1 justify-center py-8 px-6 gap-5">
                    <Pressable
                        className="border-2 rounded-2xl border-p2 py-4 px-5 flex-row items-center gap-4 bg-p2/10"
                        onPress={() => navigation.navigate('Camera')}
                    >
                        <Image source={require('../../assets/camera_main.png')} className="h-10 w-10" />
                        <View>
                            <Text className="text-p2 font-bold text-base">Use Camera</Text>
                            <Text className="text-text2 text-xs">Identify live with your camera</Text>
                        </View>
                    </Pressable>

                    <Pressable
                        className="border-2 rounded-2xl border-p1 py-4 px-5 flex-row items-center gap-4 bg-p1/10"
                        onPress={() => navigation.navigate('Upload')}
                    >
                        <Image source={require('../../assets/gallery_main.png')} className="h-10 w-10" />
                        <View>
                            <Text className="text-p1 font-bold text-base">Upload Image</Text>
                            <Text className="text-text2 text-xs">Identify from your gallery</Text>
                        </View>
                    </Pressable>

                    <Pressable
                        className="border-2 border-[#75DDAE] rounded-2xl bg-p1/5 py-4 px-5 flex-row items-center gap-4"
                        onPress={() => navigation.navigate('All')}
                    >
                        <Image source={require('../../assets/pokeball.png')} className="h-10 w-10" />

                        <View>
                            <Text className="text-[#79E7B8] font-bold text-base">All Pokémon</Text>
                            <Text className="text-text2 text-xs">Browse the full Pokédex</Text>
                        </View>
                    </Pressable>
                </View>
            </View>

            <Tab />
        </View>


    )
}

export default Home

const styles = StyleSheet.create({})