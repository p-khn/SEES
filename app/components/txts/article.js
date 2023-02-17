import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform, TouchableOpacity, Modal, ActivityIndicator, Dimensions } from 'react-native';


import Input from '../../utils/forms/input';
import ValidationRules from '../../utils/forms/validationRules';

import {connect} from 'react-redux';
import {addArticle} from '../../store/actions/article_actions';
import {bindActionCreators} from 'redux';
import {autoSignIn} from '../../store/actions/users_actions';
import {getToken, setToken} from '../../utils/urls';



class Article extends Component {
  
  state = {
    notAuth:true,
    loading: false,
    modal: false,
    type: 'Save',
    action: 'Save',
    actionMode: 'Save It',
    hasError: false,
    s3URI:'',
    form: {
      title: {
        value: "",
        valid: false,
        type: "textinput",
        rules: {
          isRequired: true
        }
      },
      content: {
        value: "",
        valid: false,
        type: "textinput",
        rules: {
          isRequired: true
        }
      }

    }
  }

  formHasError = () => (
    this.state.hasError ?
      <View style={styles.errorContainer}>
        <Text style={styles.errorLabel}>All inputs are required</Text>
      </View>
      : null
  )
  updateInput = (name, value) => {
    this.setState({
      hasError: false
    })

    let formCopy = this.state.form;
    formCopy[name].value = value;

    let rules = formCopy[name].rules;

    let valid = ValidationRules(value, rules, formCopy);

    formCopy[name].valid = valid;

    this.setState({
      form: formCopy
    })
  }
  saveIt = () => {
    let isFormValid = true;

    let formToSubmit = {};

    const formCopy = this.state.form;

    for (let key in formCopy) {
      if (this.state.type === 'Save') {
        isFormValid = isFormValid && formCopy[key].valid;
        formToSubmit[key] = formCopy[key].value;
      }
    }

    if (isFormValid) {
      this.setState({
        // modal: !this.state.modal ? true : false
        // modal: true
        loading:true
      });

      getToken((value) =>{
        if(value[3][1] === null){
          this.setState({
            notAuth:true,
            loading:false,
            modal:true
          })
        }else{
          this.setState({
            notAuth:false
          })
           //when we want to save data need to check our token is expired or not
       const dateNow =  new Date();
       const expiration = dateNow.getTime();
       const form = {
         ...formToSubmit,
         uid:value[3][1],
         date:dateNow.getTime(),
         image:this.state.s3URI
       }
       if (expiration > value[2][1]){
          this.props.autoSignIn(value[1][1]).then(() => {
            setToken(this.props.User.auth,() => {
              this.props.addArticle(form,this.props.User.auth.token).then(() => {
                this.setState({
                  loading:false,
                  modal: true
                });
              });
            })
          })
       }else{
       
        this.props.addArticle(form,value[0][1]).then(() => {
          this.setState({
            loading:false,
            modal: true
          });
        });
       }
        }
       
      })

    } else {
      this.setState({
        hasError: true
      })
    }
  }
  handelModal = () => {
   
    this.props.navigation.navigate('Txts');
     this.setState({
      modal: false
    });
  
  }

  // resetEditScreen = () =>{
  //   const formCopy = this.state.form;

  //   for(let key in formCopy){
  //     formCopy[key].valid = false;
  //     formCopy[key].value = "";
  //   }
    
  // }
  componentDidMount(){
    const params = this.props.navigation.state.params;
    // console.log(params.text.fullText)
    // console.log(params.uri)
    this.setState({
      s3URI:params.uri
    });
    // this.setState(prevState =>({
    //   ...prevState,
    //   form:{
    //     ...prevState.form,
    //     content:{
    //       ...prevState.form.content,
    //       value:params.text.fullText
    //     }
    //   }
    // }));
    this.updateInput("content",params.text.fullText)
    
  }

  render() {
   
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )
    } else {
      return (
        <ScrollView style={styles.container}>
          <View>

            <Input
              placeholder="Enter a title"
              placeholderTextColor="#bfbfbf"
              type={this.state.form.title.type}
              value={this.state.form.title.value}
              autoCapitalize={"words"}
              onChangeText={value => this.updateInput("title", value)}
              overideStyle={styles.inputStyleTitle}
            />

            <Input
              placeholder="Content is loading ..."
              placeholderTextColor="#bfbfbf"
              type={this.state.form.content.type}
              value={this.state.form.content.value}
              autoCapitalize={"sentences"}
              onChangeText={value => this.updateInput("content", value)}
              numberOfLines={25}
              multiline={true}
              scrollEnabled={true}
              overideStyle={styles.inputStyle}
            />
            {this.formHasError()}
            <View style={{ marginTop: 20 }}>
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={this.saveIt}
                >
                  <Text style={styles.buttonLabel}>{this.state.action}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Modal
              visible={this.state.modal}

            >
              <View style={styles.ModalContainer}>
                <Text style={styles.ModalLabel}>{this.state.notAuth? 'Sorry, need to be registered / logged in to save your data !!!':
                  'Successfully Save'}</Text>
                <View style={styles.button}>
                  {this.state.notAuth ? 
                  <TouchableOpacity

                  onPress={() => {
                    this.setState({modal:false});
                    this.props.navigation.navigate('Auth');
               
                }}
                >
                  <Text style={styles.buttonLabel}>Login / Register</Text>
                </TouchableOpacity>
                :  
                <TouchableOpacity
                    onPress={this.handelModal}
                  >
                    <Text style={styles.buttonLabel}>Okay</Text>
                  </TouchableOpacity>
                }
                  
                </View>
              </View>
            </Modal>

          </View>
        </ScrollView>



      );
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50
  },
  button: {
    ...Platform.select({
      ios: {
        marginBottom: 0
      },
      android: {
        marginBottom: 10,
        marginTop: 10
      }
    }),
    alignItems: 'center'
  },
  buttonLabel: {
    color: "#b800e6",
    fontSize: 20
  },
  inputStyleTitle:{
    color: "#000000",
    borderBottomColor: '#b800e6',
    borderLeftWidth:1,
    borderLeftColor:'#b800e6',
    borderRightWidth:1,
    borderRightColor:'#b800e6',
    borderTopWidth:1,
    borderTopColor:'#b800e6',
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
  },
  inputStyle: {
    height:(Dimensions.get('window').height)/2,
    color: "#000000",
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderBottomColor:'#b800e6',
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
    borderTopWidth:1,
    borderTopColor: '#b800e6',
    borderLeftWidth:1,
    borderLeftColor:'#b800e6',
    borderRightWidth:1,
    borderRightColor:'#b800e6'

  },
  ModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ModalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#00cc99",
    padding:10
  },
  errorLabel: {
    marginBottom: 10,
    marginTop: 30,
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    color: '#ffa31a',
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  loading: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: 'center',
    justifyContent: 'center'
  }
});

function mapStateToProps(state){
  return{
    Article:state.Article,
    User:state.User
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({autoSignIn,addArticle},dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Article);