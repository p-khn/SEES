import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { AsyncStorage } from 'react-native';

class Logout extends Component {
   
    render() {

        return (
        
                    <View style={styles.logout}>
                        <Icon name="md-exit" size={80} color="#bfbfbf" />
                        <Text style={styles.logoutText}>Would you like to logout ?</Text>
                        <View style={styles.decisionContianer}>

                            <TouchableOpacity

                                onPress={() => {
                                
                                    this.props.navigation.navigate('Txts');

                                }}
                            >
                                <Text style={styles.logReg}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    AsyncStorage.clear();
                                    this.props.navigation.navigate('Auth');

                                }}
                            >
                                <Text style={styles.logReg}>Yes</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
               
         
        )
    }
}
const styles = StyleSheet.create({
    decisionContianer: {
        flex: 1,
        flexDirection: 'row',
        padding: 10
    },
    bottomCardDate: {
        color: '#828282',
        fontSize: 12,
        fontFamily: 'Roboto-Light'
    },

    logout: {
        flex: 1,
        margin: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16
    },
    logReg: {
        color: "#00cc99",
        fontSize: 22,
        fontFamily: 'Roboto-Bold',
        padding: 10
    }
});

export default Logout;