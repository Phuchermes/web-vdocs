import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { useState, useEffect } from 'react'
import { ThemedView } from '../../components/ThemedView'
import { ThemedText } from '../../components/ThemedText'
import { Spacer }  from '../../components/Spacer'
import { ThemedButton }  from '../../components/ThemedButton'
import { ThemedTextInput }  from '../../components/ThemedTextInput'
import { useUser } from '../../hooks/useUser'
import ThemedLoader from '../../components/ThemedLoader'

export const Register = () => {
const router = useRouter();
  const { user, authChecked, register } = useUser();
  const [loading, setLoading] = useState(false);
  const [userId, setId] = useState("");
  const [name, setName] = useState("");
  const [deptname, setDeptName] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

      useEffect(() => {
    if (authChecked && user) {
      router.replace("/profile");
    }
  }, [authChecked, user]);

  const handleSubmit = async () => {
    if (!userId || !name || !deptname ||!department || !password) return alert("Điền đầy đủ thông tin");
    setLoading(true);
    const res = await register({ userId, name, deptname, department, password });
    setLoading(false);
    if (res.success) {
      router.replace("/profile");
    } else {
      alert(res.message);
    }
  };

  if (!authChecked || (authChecked && user)) return <ThemedLoader />;


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ThemedView style={styles.container}>
        <Spacer/>
        <ThemedText title={true} style={styles.title}>
        Đăng Ký
        </ThemedText>

        <ThemedTextInput
                style={{width: '80%', marginBottom: 20}}
                placeholder="ID"
                value={userId}
                onChangeText={setId}
                />
        
                <ThemedTextInput
                style={{width: '80%', marginBottom: 20}}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                />

                <ThemedTextInput
                style={{width: '80%', marginBottom: 20}}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                />

                <ThemedTextInput
                style={{width: '80%', marginBottom: 20}}
                placeholder="DeptName"
                value={deptname}
                onChangeText={setDeptName}
                />

                <ThemedTextInput
                style={{width: '80%', marginBottom: 20}}
                placeholder="Department"
                value={department}
                onChangeText={setDepartment}
                />

        
        <ThemedButton onPress={handleSubmit}>
            <Text style={{ color: "#fff" }}>Đăng kí</Text>
        </ThemedButton>

        <Spacer/>


        <Spacer height={100}/>
            <Link href='/login'>
                <ThemedText style={{textAlign: 'center'}}>
                    Đăng Nhập
                </ThemedText>
            </Link>
               
    </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Register

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
        btn:{
            backgroundColor: Colors.primary,
            padding: 15,
            borderRadius: 5,
        },
        pressed: {
            opacity: 0.8
        },
        error:{
            color: Colors.warning,
            padding: 10,
            backgroundColor: '#f5c1c8',
            borderColor: Colors.warning,
            borderWidth: 1,
            borderRadius: 6,
            marginHorizontal: 10
        }
})