import React from 'react';
// import {Platform} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack';
import {
    createSwitchNavigator,
    createAppContainer
} from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import Signin from './components/auth';
import Txts from './components/txts';
import Article from './components/txts/article';
import Records from './components/records';
import RecordsArticle from './components/records/article';
import Logout from './components/logout';

import Logo from './utils/logo';

import { NavigationActions } from 'react-navigation';

const headerConf = {
    headerLayoutPreset:'center',
    defaultNavigationOptions:{
        headerStyle:{
            backgroundColor:'#7a0099'
        },
        headerTintColor:'white',
        headerTitle:Logo
    }

}

const RecordStack = createStackNavigator({
    Records:Records,
    Article:RecordsArticle
},headerConf);


const TxtsStack = createStackNavigator({
    Txts:Txts,
    Article:Article
},headerConf);

const LogoutStack = createStackNavigator({
    Logout:Logout,
    
},headerConf);

const AppStack = createBottomTabNavigator ({
    Txts:TxtsStack,
    Records:RecordStack,
    Logout:LogoutStack
},{
    tabBarOptions:{
        activeTintColor:'#ffffff',
        showLabel:false,
        activeBackgroundColor:'#b800e6',
        inactiveBackgroundColor:'#7a0099',
        style:{
            backgroundColor:'7a0099'
        }
    },
    initialRouteName:'Txts',
    defaultNavigationOptions:({navigation}) => ({
        tabBarIcon:(focused, horizontal, tintColor) => {
            const {routeName} = navigation.state;
            let iconName;
             if(routeName === 'Txts'){
                iconName = `md-qr-scanner`;
             }else if(routeName === 'Records'){
               
                iconName = `md-list-box`;
             }else if(routeName === 'Logout'){
                iconName = `md-exit`;
             }

            return <Ionicons name={iconName} size={30} color={tintColor} />
        },
        tabBarOnPress: ({navigation}) => {
            const {routeName} = navigation.state;
            navigation.navigate(routeName); 
            navigation.reset([NavigationActions.navigate({ routeName})], 0);     
          }
    })
});

const AuthStack = createStackNavigator({
    Signin:Signin
},{
    headerMode:'none'
});

export const RootNavigator = () =>{
    return createAppContainer(createSwitchNavigator({
        App:AppStack,
        Auth:AuthStack
    },{
       initialRouteName:'Auth'
    }))
}