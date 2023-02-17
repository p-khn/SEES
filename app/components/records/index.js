import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/dist/Ionicons';
// import SampleImage from '../../assets/images/2.png';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autoSignIn, getUserTexts } from '../../store/actions/users_actions';
import { getToken, setToken } from '../../utils/urls';
import Moment from 'moment';




class RecordsComponent extends Component {
  
  state = {
    search: '',
    loading: true,
    isAuth: true,
    data:[],
    searchEmpty:'true'
  }

  manageState(loading, isAuth) {
    this.setState({
      loading,
      isAuth
    })
  }

  componentDidMount() {
    const User = this.props.User;
    getToken((value) => {
      if (value[0][1] === null) {
        this.manageState(false, false)
      } else {
        this.props.autoSignIn(value[1][1])
          .then(() => {
            !User.auth.token ?
              this.manageState(false, false)
              :
              setToken(User.auth, () => {
                this.manageState(false, true)
                this.props.getUserTexts(User.auth.uid);
                
              })
          })
      }
    })
   
  }

 
  updateSearch = (value) => {
    let data=[]
    if(value){
      this.setState({
        searchEmpty:false
      })
    }else{
      this.setState({
        searchEmpty:true
      })
    }
    this.setState({ search: value });
    for(let key in this.props.User.userTexts){
  
      if(this.props.User.userTexts[key].title.toLowerCase().includes(value.toLowerCase())){
       
       data.push(this.props.User.userTexts[key])
      }
    }
    this.setState({
      data:data
    })
  };

  searchIcon = () => (
    <Ionicons name={`md-search`} size={25} color={'#b800e6'}  />
  );

  clearIcon = () => (
    <Ionicons name={`md-close`} size={25} color={'#b800e6'} onPress={() => this.setState({search:'',searchEmpty:true})}/>
  );

  searchResult = (Texts) =>(
     Texts ?
      Texts.map((item, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => this.props.navigation.navigate('Article',{
            ...item
          })}
        >
          <View style={styles.cardContainers}>
            <View>
              <Image
                style={{ width: '100%', height: 150, justifyContent: 'space-around' }}
                source={{uri:`${item.image}`}}
                resizeMode='center'
              />
            </View>
            <View style={styles.contentCard}>
              <Text style={styles.titleCard}>Title: {item.title}</Text>
              <View style={styles.bottomCard}>
                <Text style={styles.bottomCardDate}>Saved at {Moment(item.date).format('LLL')}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))
      : null
  )

  renderText = (Texts) => (
  
    Texts.userTexts ?
      Texts.userTexts.map((item, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => this.props.navigation.navigate('Article',{
            ...item
          })}
        >
          <View style={styles.cardContainers}>
            <View>
              <Image
                style={{ width: '100%', height: 150, justifyContent: 'space-around' }}
                source={{uri:`${item.image}`}}
                resizeMode='center'
              />
            </View>
            <View style={styles.contentCard}>
              <Text style={styles.titleCard}>Title: {item.title}</Text>
              <View style={styles.bottomCard}>
                <Text style={styles.bottomCardDate}>Saved at {Moment(item.date).format('LLL')}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))
      : null

      
  )
  

  render() {
    // const params =this.props.navigation;
  
    if (this.state.loading) {
      return (
        <View style={styles.waitServ}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (

        <ScrollView 
       
        style={{ backgroundColor: '#F0F0F0' }}>

          {this.state.isAuth ?
            <View>

              <SearchBar
                placeholder="Type Here..."
                value={this.state.search}
                onChangeText={value => this.updateSearch(value)}
                lightTheme={true}
                searchIcon={() => this.searchIcon}
                clearIcon={() => this.clearIcon()}
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.searchInput}
                
              />
            
              { this.state.searchEmpty ?
                this.renderText(this.props.User)
                :
                this.searchResult(this.state.data)
              }
            </View>

            :

            <View style={styles.notAuth}>
              <Icon name="md-sad" size={80} color="#bfbfbf" />
              <Text style={styles.notAuthText}>We are sorry you need to be registered / logged in to see your records !!!</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Auth')}
              >
                <Text style={styles.logReg}>Login / Register</Text>
              </TouchableOpacity>
            </View>

          }

        </ScrollView>
      );
    }

  }
}

const styles = StyleSheet.create({
  cardContainers: {
    backgroundColor: '#ffffff',
    margin: 10,
    shadowColor: '#dddddd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 2
  },
  contentCard: {
    borderWidth: 1,
    borderColor: '#dddddd'
  },
  titleCard: {
    fontFamily:'Roboto-Bold',
    color: "#232323",
    fontSize: 16,
    padding: 10
  },
  bottomCard: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    padding: 10
  },
  bottomCardDate: {
    color: '#828282',
    fontSize: 12,
    fontFamily:'Roboto-Light'
  },
  searchContainer: {

    backgroundColor: '#f1f1f1',
    borderBottomWidth: 0

  },
  searchInput: {
    backgroundColor: '#ffffff'
  },
  notAuth: {
    flex: 1,
    margin: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  waitServ: {
    flex: 1,
    margin: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notAuthText: {
    fontWeight: 'bold'
  },
  logReg: {
    color: "#00cc99",
    fontSize: 22,
    fontWeight: 'bold',
    padding: 10
  }
});
function mapStateToProps(state) {
  // console.log(state)
  return {
    User: state.User
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ autoSignIn, getUserTexts }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(RecordsComponent);
