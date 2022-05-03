import React, {Component, useState} from 'react';
import {StyleSheet, ScrollView, View, Text, PixelRatio, I18nManager, Image, Animated, Dimensions, TouchableOpacity, FlatList} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from "@react-native-community/geolocation";

var inter, s = 0, m = 0, h = 0;
var lat2, lon2, latSave, lonSave;

export function normalize(size) 
{
  if (Platform.OS === 'ios') 
  {
    return Math.round(PixelRatio.roundToNearestPixel(size))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(size)) - 2
  }
}
export default class App extends Component
{
  constructor(props) 
  {
      super(props);
      this.array = [];
      I18nManager.forceRTL(true);
      this.state = {region: null, initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }, ifRunTimer: false, s: '0'+0, m: '0'+0, h: '0'+0, arrayList: [], OpenLocations: false};
  }
  
  componentDidMount() 
  {
    //inter = setInterval(this.killinter, 1000)
    Geolocation.getCurrentPosition((info) => 
    {
      let lat = info.coords.latitude;
      let long = info.coords.longitude;

      console.log(lat);
      console.log(long);
      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      lat2 = lat, lon2 = long;
      this.setState({ initialPosition: initialRegion });
    },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.setState({ arrayList: [...this.array] })
  }
  componentWillUnmount() 
  {
    clearInterval(inter)
    this.setState({ifRunTimer: false})
  }
  onRegionChange(region)  
  {
    console.log(region.latitude);
    console.log(region.longitude);
    lat2 = region.latitude;
    lon2 = region.longitude;
  }
  runTimer = () =>
  {
    if(this.state.ifRunTimer == false) 
    {
      inter = setInterval(this.RunTimer, 1000);
      latSave = lat2, lonSave = lon2;
    }
    else 
    {
      clearInterval(inter);
      this.setState({s : '0'+0, m : '0'+0, h : '0'+0});
      s = 0, m = 0, h = 0;
      this.array.push({lat : latSave, lon: lonSave, time: this.state.h+':'+this.state.m+':'+this.state.s});
      this.setState({ arrayList: [...this.array] })
    }
    this.setState({ifRunTimer: !this.state.ifRunTimer})
  }
  RunTimer = ()=>
  {
    s = s + 1;
    if(s == 60) s = 0, m = m + 1;
    if(m == 60) s = 0, m = 0, h = h + 1;
    if(s < 10) this.setState({s : '0'+s})
    else this.setState({s : s})
    if(m < 10) this.setState({m : '0'+m})
    else this.setState({m : m})
    if(h < 10) this.setState({h : '0'+h})
    else this.setState({h : h})
  }
  FlatListItemSeparator = () => 
  {
    return ( <View style={{height: 1, width: "100%", backgroundColor: "#607D8B",}}/> );
  }
  OpenLocations = () =>
  {
    if(this.state.ifRunTimer != true) this.setState({OpenLocations: true})
  }
  CloseLocations = () =>
  {
    if(this.state.ifRunTimer != true) this.setState({OpenLocations: false})
  }
  render() 
  {
    return (

      <View  style={{flex:27, backgroundColor: '#fff'}}>
        <View style={{elevation: 6, backgroundColor: '#fff', width: '100%', height: '8%'}}> 
          <TouchableOpacity style={{top: '28%', left: 30,zIndex: 99999999, position:'absolute', height: 30, width: 30}}>
            <Image source={require('./Images/vector.png')} style={{resizeMode: 'cover', height: '100%', width: '100%'}}/>
          </TouchableOpacity>
          <View style={{top: '-4%', right: 30, position:'absolute', height: 70, width: 120}}>
            <Image source={require('./Images/logo.png')} style={{resizeMode: 'contain', height: '100%', width: '100%'}}/>
          </View>
        </View>
        {this.state.OpenLocations && <View style={{zIndex: 99999, height: '84%', width: '100%',}}>
          <View style={{height: '8%', width: '100%', borderBottomColor: '#06928c', borderBottomWidth: 1, flexDirection: 'row'}}>
            <Text style={{padding: 10, fontSize: normalize(18), textAlign: 'center', height: 50, color: '#000', fontWeight: 'bold', left: '40%'}}>זמן</Text>
            <Text style={{padding: 10, fontSize: normalize(18), textAlign: 'center', height: 50, color: '#000', fontWeight: 'bold', left: '120%'}}>קו אורך</Text>
            <Text style={{padding: 10, fontSize: normalize(18), textAlign: 'center', height: 50, color: '#000', fontWeight: 'bold', left: '300%'}}>קו רוחב</Text>
          </View>
          <FlatList style={{height: '92%'}}
            data={this.state.arrayList}
            width='100%'
            extraData={this.state.arrayList}
            keyExtractor={(index) => index.toString()}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item }) => <View style={{flexDirection: 'row'}}>
                <Text style={styles.itemTime}>{item.time}</Text>
            <Text style={styles.item}>{item.lon}</Text>
            <Text style={styles.item}>{item.lat}</Text>
              </View>}
          />
        </View>}
        {!this.state.OpenLocations && <MapView style={{height: '84%', width: "100%"}}
          region={this.state.initialPosition}
          onRegionChange={this.onRegionChange}
          showsUserLocation={false}
        />}
        {!this.state.OpenLocations && <TouchableOpacity onPress={this.runTimer} style={{height: 260, width: 260, position: 'absolute', backgroundColor: (!this.state.ifRunTimer ? '#00b2ab50' : '#ff849250'), alignSelf: 'center', top: '30%', borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2, justifyContent: 'center'}}>
          <View style={{height: 215, width: 215, position: 'absolute', backgroundColor: (!this.state.ifRunTimer ? '#00b2ab99': '#ff849290'), alignSelf: 'center', borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2, justifyContent: 'center'}}>
            <View style={{height: 190, width: 190, position: 'absolute', backgroundColor: (!this.state.ifRunTimer ? '#06928c': '#e23d51'), alignSelf: 'center', borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2, justifyContent: 'center'}}>
              {this.state.ifRunTimer && <Text style={{color: '#fff', fontWeight: 'bold', fontSize: normalize(44), alignSelf: 'center'}}>{this.state.h}:{this.state.m}:{this.state.s}</Text>}
              {!this.state.ifRunTimer && <Text style={{color: '#fff', fontWeight: 'bold', fontSize: normalize(44), alignSelf: 'center'}}>הגעתי</Text>}
              {!this.state.ifRunTimer && <Text style={{color: '#fff', fontSize: normalize(22), alignSelf: 'center', fontWeight: '100'}}>התחל לרשום</Text>}
            </View>
          </View>
        </TouchableOpacity>}
        <View style={{elevation: 6, backgroundColor: '#fff', width: '100%', height: '8%',flexDirection: 'row'}}> 
          <TouchableOpacity style={{height: '100%', width: '50%', justifyContent: 'center'}} onPress={this.CloseLocations}>
            <Image source={require('./Images/Home.png')} style={{resizeMode: 'contain', height: '56%', alignSelf: 'center'}}/>
            <Text style={{fontSize: normalize(13), fontWeight: (!this.state.OpenLocations ? 'bold' : '100'), color: '#000', alignSelf: 'center'}}>ראשי</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{height: '100%', width: '50%', justifyContent: 'center'}} onPress={this.OpenLocations}>
            <Image source={require('./Images/Locations.png')} style={{resizeMode: 'contain', height: '56%', alignSelf: 'center'}}/>
            <Text style={{fontSize: normalize(13), color: '#000', fontWeight: (this.state.OpenLocations ? 'bold' : '100'), alignSelf: 'center'}}>המקומות שלי</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create(
{
  Vi:
  {
    height: 200, 
    width: 200, 
    alignSelf: 'center',
  },
  flexContainer: {
    flex: 1
  },
  item: {
    padding: 10,
    fontSize: normalize(15),
    textAlign: 'center',
    height: 50,
    color: '#000'
  },
  itemTime: {
    padding: 10,
    fontSize: normalize(15),
    textAlign: 'center',
    height: 50,
    color: '#000',
    fontWeight: 'bold'
  },
});
