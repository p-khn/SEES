import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Amplify from '@aws-amplify/core';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from '../../../src/aws-exports';
import Auth from "@aws-amplify/auth";
import { Storage } from 'aws-amplify';

import { Buffer } from "buffer";

import MainImage from '../../assets/images/photo.png';
// import { StackRouter } from 'react-navigation';

import textractImage from '../../assets/images/textract.png';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true
  }
});
Amplify.addPluggable(new AmazonAIPredictionsProvider());
Auth.configure({
  userPoolId: "USER POOL ID",
  identityPoolId: "IDENTITY POOL ID",
  region: "REGION"
});


class TxtsComponent extends Component {

  state = {
    imageName: null,
    imageData: null,
    imageURL: null,
    s3URI: null,
    cloudIcon: false,
    modal: false,
    photoUploadS3: false

  }

  addPhoto = () => {
    ImagePicker.showImagePicker({}, response => {
      if (response.didCancel) {
        console.warn("See you again")
      } else if (response.error) {
        console.warn(response.error)
      } else {
        console.log(response)
        this.setState({
          imageName: response.fileName,
          imageData: response.data,
          imageURL: response.uri,
          photoUploadS3: true
        });
        Storage.put(response.fileName, new Buffer(response.data, "base64"), {
          level: 'public',
          contentType: "image/jpeg"
        }).then(() => {
          // console.log(this.state.imageName)
          Storage.get(this.state.imageName).then((result) => {

            this.setState({
              s3URI: result,
              photoUploadS3: false,
              cloudIcon: true

            });
            // console.log(this.state.s3URI)
            console.log("successfully saved image to bucket");
          }).catch(err => {
            console.log(err);
          });

        }).catch(err => {
          console.log("error saving file to bucket")
        });
      }
    });
  }
  uploadCloud = () => (
    this.state.cloudIcon ?
      <TouchableOpacity
        onPress={() => this.sendToAws()}
        style={styles.icons}
      >
        <Ionicons name={`md-cloud-upload`} size={52} color={'#b800e6'} />
      </TouchableOpacity>
      : null
  )

  sendToAws = () => {
    // console.log(this.state.imageName)
    this.setState({
      modal: true
    })
    Predictions.identify({
      text: {
        source: {
          key: this.state.imageName
        }
      },

    }).then(({ text }) => {
      // console.log(text);
      this.setState({
        modal: false
      })
      this.props.navigation.navigate('Article', {
        text,
        uri: this.state.s3URI,
      });
    }).catch(err => {

      console.log(err)
    })
    // this.props.navigation.navigate('Article');
  }
  render() {

    return (
      <View style={styles.imagePicker}>
        <Image
          source={this.state.imageURL === null ? MainImage : { uri: this.state.imageURL }}
          style={styles.photo}
        />
        <TouchableOpacity
          onPress={() => this.addPhoto()}
          style={styles.icons}
        >
          <Text style={styles.preparing}>
            {this.state.photoUploadS3 ? "Preparing photo ..."
              : <Ionicons name={`md-camera`} size={52} color={'#b800e6'} />}
          </Text>

        </TouchableOpacity>

        {this.uploadCloud()}

        <Modal
          visible={this.state.modal}

        >
          <View style={styles.ModalContainer}>
            <Image 
            source={textractImage}
            style={styles.textractImage}
            />
            <Text style={styles.ModalLabel}>Extracting...</Text>
            <ActivityIndicator />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagePicker: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: 'center',
    justifyContent: 'center'
  },
  photo: {
    width: '100%',
    height: 400
  },
  textractImage:{
    width:'40%',
    height:100
  },
  icons: {
    marginTop: 10
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 10,
  },
  ModalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#00cc99",
    padding: 10
  },
  ModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  preparing: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#00cc99",
 
  }
});

export default TxtsComponent;