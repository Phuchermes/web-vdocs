import {Image, useColorScheme} from 'react-native'

import DarkLogo from '../assets/Capture.png'
import LightLogo from '../assets/Capture.png'

export const ThemedLogo = ({...props}) => {
    const colorScheme = useColorScheme()
    const logo = colorScheme === 'dark' ? DarkLogo : LightLogo
  return (
    <Image source={logo}{...props}/>
  )
}

export default ThemedLogo