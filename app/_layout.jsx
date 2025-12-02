import { StyleSheet, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from "../constants/Colors"
import { UserProvider } from '../contexts/UserContext'


export const Rootlayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

  return (
    <UserProvider>
    <Stack screenOptions={{
        headerShown: false, animation: "none",
        headerStyle:{ backgroundColor: theme.navBackground},
        headerTintColor: theme.title,
      }}/>
         
    </UserProvider>
    
  );
}

export default Rootlayout

const styles = StyleSheet.create({

})


