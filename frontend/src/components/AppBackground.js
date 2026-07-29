import {View, Platform, ImageBackground} from 'react-native'

const resolveSrc = (src)=>{
    if (!src) return undefined
    if (typeof src === 'string') return src
    return src.uri || src.default
}

const WebBackground = ({source, resizeMode='cover', blurRadius = 0, className='', style,children})=>{
    const uri = resolveSrc(source)
    return (
        <View className={`relative overflow-hidden ${className}`} style={style}>
            <div
                style={{
                    position: 'fixed',
                    top: -blurRadius *2,
                    left: -blurRadius *2,
                    right: -blurRadius *2,
                    bottom: -blurRadius *2,
                    backgroundImage: uri ? `url(${uri})` : undefined,
                    backgroundSize: resizeMode === 'cover' ? 'cover' : resizeMode === 'contain' ? 'contain' : 'auto',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: blurRadius ? `blur(${blurRadius}px)` : undefined,
                    
                }}
            />
            <View className="flex-1 z-1 relative">
                {children}
            </View>

        </View>
    )
}
console.log("Platform.OS", Platform.OS)
const AppBackground = Platform.OS === 'web'? WebBackground: ImageBackground

export default AppBackground