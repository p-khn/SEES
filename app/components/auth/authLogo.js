import React from 'react';
import {View, Image} from 'react-native';

import LogoImage from '../../assets/images/SEES_LOGO.png';

 const LogoComponent = () => (
     <View style={{alignItems:'center'}}>
         <Image
            source={LogoImage}
            resizeMode={'center'}
            style={{ 
                width:180,
                height:180
            }}
         />
     </View>
 )

 export default LogoComponent; 