import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform  } from 'react-native';

import Input from '../../utils/forms/input';
import ValidationRules from '../../utils/forms/validationRules';

import {connect} from 'react-redux';
import {signUp, signIn} from '../../store/actions/users_actions';
import {bindActionCreators} from 'redux';

import {setToken} from '../../utils/urls';
class AuthForm extends Component {

    state = {
        type:'Login',
        action:'Login',
        actionMode:'I am new here',
        hasError:false,
        networkError:false,
        form:{
            email:{
                value:"",
                valid:false,
                type:"textinput",
                rules:{
                    isRequired:true,
                    isEmail:true
                }
            },
            password:{
                value:"",
                valid:false,
                type:"textinput",
                rules:{
                    isRequired:true,
                    minLength:6
                }
            },
            confirmPassword:{
                value:"",
                valid:false,
                type:"textinput",
                rules:{
                    confirmPass:'password'
                  
                }
            }
        }
    }

    formHasError = () => (
        this.state.hasError ? 
            <View style={styles.errorContainer}>
                <Text style={styles.errorLabel}>Entered info are not correct</Text>
            </View>
        :null
    )

    networkHasError = () => (
        this.state.networkError ? 
            <View style={styles.errorContainer}>
                <Text style={styles.errorLabel}>Email/Password are not correct</Text>
            </View>
        :null
    )

    confirmPassword = () => (
        this.state.type != 'Login' ? 
        <Input
        placeholder="Confirm your password"
        placeholderTextColor="#cecece"
        type={this.state.form.confirmPassword.type}
        value={this.state.form.confirmPassword.value}
        onChangeText={ value => this.updateInput("confirmPassword", value)}
        secureTextEntry
      />
      :null
    )

    changeFormType = () => {
        const type = this.state.type;

        this.setState({
            type: type === 'Login' ? 'Register' : 'Login',
            action: type === 'Login' ? 'Register' : 'Login',
            actionMode:  type === 'Login' ? 'I have an account' : 'I am new here'
        });
    }

    updateInput = (name, value) =>{
        this.setState({
            hasError:false,
            networkError:false
        });

        let formCopy = this.state.form;
        formCopy[name].value = value;

        let rules = formCopy[name].rules;
        let valid = ValidationRules(value, rules, formCopy);

        formCopy[name].valid = valid;

        // console.log(valid);

        this.setState({
            form:formCopy
        })

    }
    manageAccess = () =>{
        if(!this.props.User.auth.uid){
            this.setState({
                networkError:true
            });
        }else{
            setToken(this.props.User.auth,() =>{
                this.setState({
                    networkError:false
                });
                this.props.goNext();
            });
        }
    }
    submitUser = () => {
        let isFormValid = true;

        let formToSubmit = {};

        const formCopy = this.state.form;

        for (let key in formCopy){
            if(this.state.type === 'Login'){
                //Login
                if(key !== 'confirmPassword'){
                    isFormValid = isFormValid && formCopy[key].valid  
                    formToSubmit[key]=formCopy[key].value
                }
            }else{
                //Register
                isFormValid = isFormValid && formCopy[key].valid  
                formToSubmit[key]=formCopy[key].value
            }
        }

        if(isFormValid){
            if(this.state.type === 'Login'){
                this.props.signIn(formToSubmit).then(()=>{
                    this.manageAccess()
                }).catch(err =>{console.log(err)})
            }else{
                this.props.signUp(formToSubmit).then(()=>{
                    this.manageAccess()
                }).catch(err =>{console.log(err)})
            }


        }else{
            this.setState({
                hasError:true
            })
        }

    }
   

    render() {
        return (
            <View>
              <Input
                placeholder="Enter your email"
                placeholderTextColor="#cecece"
                type={this.state.form.email.type}
                value={this.state.form.email.value}
                autoCapitalize={"none"}
                keyboardType={"email-address"}
                onChangeText={ value => this.updateInput("email", value)}
              />

            <Input
                placeholder="Enter your password"
                placeholderTextColor="#cecece"
                type={this.state.form.password.type}
                value={this.state.form.password.value}
                onChangeText={ value => this.updateInput("password", value)}
                secureTextEntry
              />
            
            {this.confirmPassword()}
            {this.formHasError()}
            {this.networkHasError()}

            <View style={{marginTop:20}}>
                <View style={styles.button}>
                    <TouchableOpacity 
                        onPress={this.submitUser}
                    >
                        <Text style={styles.buttonLabel}>{this.state.action}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity 
                        onPress={this.changeFormType}
                    >
                        <Text style={styles.buttonLabel}>{this.state.actionMode}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity 
                        onPress={() => this.props.goNext()}
                    >
                        <Text style={styles.buttonLabel}>Free trial</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </View>

        );
    }
}

const  styles = StyleSheet.create({
    // errorContainer:{
    //     borderRadius:5,
    //     opacity:0.7,
    //     marginBottom:10,
    //     marginTop:30,
    //     padding:10,
    //     backgroundColor:"#ffa31a"
    // },
    errorLabel:{
        marginBottom:10,
        marginTop:30,
        fontSize:16,
        fontWeight:'bold',
        padding:10,
        color:'#ffa31a',
        textAlignVertical:'center',
        textAlign:'center'
    },
    button:{
        ...Platform.select({
            ios:{
                marginBottom:0
            },
            android:{
                marginBottom:10,
                marginTop:10
            }
        }),
        alignItems:'center'
    },
    buttonLabel:{
        color:"#ffccff",
        fontSize:20
    }
})

function mapStateToProps(state){
    // console.log(state)
    return {
        User: state.User 
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({signIn, signUp},dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(AuthForm);
