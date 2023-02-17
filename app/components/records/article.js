import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput } from 'react-native';
import Moment from 'moment';

// import SampleImage from '../../assets/images/2.png';

class RecordArticleComponent extends Component {
  render() {
    const params = this.props.navigation.state.params;
    return (
      <ScrollView style={{backgroundColor:'#F0F0F0'}}>
        <Image 
        style={{width:'100%',height:250}}
        source={{uri:params.image}}
        resizeMode='cover'
        />
        <View style={styles.articleContainer}>
            <View>
              <Text style={styles.articleTitle}>
               Title: {params.title}
              </Text>
              <Text style={styles.articleDate}>
                Saved at {Moment(params.date).format('LLL')} 
              </Text>
            </View>
            <View style={styles.articleContent}>
                <Text
                style={styles.articleText}
                selectable={true}
                >
                
                {params.content}
                </Text>
                
            </View>
        </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  articleContainer:{
    padding:10,
  },
  articleTitle:{
    fontSize:23,
    color:'#323232',
    fontFamily:'Roboto-Bold'
  },
  articleDate:{
    fontSize:12,
    color:'#828282',
     fontFamily:'Roboto-Light'
  },
  articleContent:{
    marginTop:30
  },
  articleText:{
    fontSize:14,
    lineHeight:20,
    color:'#828282',
    fontFamily:'Roboto-Light'
  }
});

export default RecordArticleComponent;