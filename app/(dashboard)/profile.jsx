import { StyleSheet, Text } from 'react-native'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedView from '../../components/ThemedView'
import { useUser } from '../../hooks/useUser'
import { ThemedButton } from '../../components/ThemedButton'
//import { Colors } from '../constants/Colors'

export const Profile = () => {
  const { logout, user } = useUser()

  return (
    <ThemedView style = {styles.container}>
      <Spacer/>
      <ThemedText title={true} style={styles.heading}>
        {user.name}
      </ThemedText>
      <Spacer height={40}/>
      <ThemedText title={true} style={styles.heading}>
        Bộ Phận {user.deptname}
      </ThemedText>
      <Spacer height={80}/>
      <ThemedButton onPress={logout}>
        <Text style={{color: '#fff'}}>Logout</Text>
      </ThemedButton>
    </ThemedView>

  )
}

export default Profile
const styles = StyleSheet.create({
    container:
        {
        flex: 1, 
        justifyContent: 'center',
        alignItems:'center'
        },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom:30
    },
    heading: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18,
    },
})