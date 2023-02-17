import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Picker } from 'react-native';

const input = (props) => {
    let template = null;

    switch(props.type){
        case 'textinput':
                template = 
                <TextInput
                    {...props}
                    style={[styles.input, props.overideStyle]}
                />
            break;

        default:
            return template;
    }


    return template;
}

const styles = StyleSheet.create({
    input:{
        width:'100%',
        borderBottomWidth:1,
        borderBottomColor:'#ffffff',
        fontSize:16,
        padding:5,
        marginTop:10,
        color:"#ffffff"
    }
})

export default input;