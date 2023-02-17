import React, {Component} from 'react';
import {Image} from 'react-native';

import LogoImage from '../assets/images/SEES_LOGO.png';

const LogoTitle = () => (
    <Image
        source={LogoImage}
        style={{ 
            width:70,
            height:70
        }}
        resizeMode='contain'
    />
)


export default  LogoTitle;