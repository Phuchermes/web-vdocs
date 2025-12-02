import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { UserOnly } from '../../components/auth/UserOnly'

export const DashLayout = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <UserOnly>
    <Tabs
        screenOptions={{ headerShown: false, tabBarStyle: {
            backgroundColor: theme.navBackground,
            paddingTop:10,
            height: 90
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarActiveTintColor: theme.iconColor
    }}>
        <Tabs.Screen name="eforms" options={{title: '', tabBarIcon: ({focused}) => <Ionicons size={24} 
          name={focused? 'document':"document-outline"}
          color={focused? theme.iconColorFocused: theme.iconColor}
        />}}/>
        <Tabs.Screen name="profile" options={{title: '', tabBarIcon: ({focused}) => (
          <Ionicons size={24} 
          name={focused? 'person':"person-outline"}
          color={focused? theme.iconColorFocused: theme.iconColor}
          />
        )}}/>
              
    </Tabs>
    </UserOnly>  
  )
}

export default DashLayout
