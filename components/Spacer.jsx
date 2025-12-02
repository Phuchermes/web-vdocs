import { View, Text } from 'react-native'
import React from 'react'

export const Spacer = ({width = "100%", height = 20}) => {
  return (
    <View style = {{width, height}}/>
  )
  
};

export default Spacer