import React, { Component } from 'react';
import { ActivityIndicator, Image, Platform, SafeAreaView, StyleSheet, Text, View, } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import api from './actions';
import _ from 'lodash';

export default class App extends Component {
  state = {
    errorMessage: null,
    isLoading: true,
    location: null,
    weather: null,
  };

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        isLoading: false,
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        isLoading: false,
        errorMessage: 'Permission to access location was denied.',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState(
      { location, },
      () => api.fetchWeatherForLocation(location)
        .then(res => this.setState({ isLoading: false, weather: res, }))
        .catch(err => this.setState({ errorMessage: err, isLoading: false, })),
    );
  };

  render() {
    const { errorMessage, isLoading, weather, } = this.state;
    if(isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
        </View>
      );
    } else if(errorMessage) {
      let text = errorMessage;
      return (
        <View style={styles.container}>
          <Text style={styles.paragraph}>{text}</Text>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={[styles.paragraph, {fontSize: 25,}]}>{'Rainminder'}</Text>
        </View>
        <View>
          <Text style={styles.paragraph}>{weather.city}</Text>
          <View style={styles.inline}>
            <Image
              source={{ uri: `http://openweathermap.org/img/wn/${weather.details.icon}@2x.png`, }}
              style={styles.icon}
            />
            <View>
              <Text style={styles.paragraph}>{_.startCase(weather.details.description)}</Text>
              <Text style={[styles.paragraph, {fontSize: 20,}]}>
                {`${_.round(weather.temp, 1)} \u2109`}
              </Text>
            </View>
          </View>
          <Text style={styles.paragraph}>
            {`${_.round(weather.temp_max, 1)}\u00B0 / ${_.round(weather.temp_min, 1)}\u00B0 `}
          </Text>
          <Text style={styles.paragraph}>
            {`Feels like: ${_.round(weather.feels_like, 1)}\u00B0 `}
          </Text>
          <Text style={styles.paragraph}>
            {`Humidity: ${_.round(weather.humidity, 1)}%`}
          </Text>
        </View>
        <View />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#c0cdd1',
    flex: 1,
    justifyContent: 'space-between',
    // paddingBottom:
    // paddingTop: Constants.statusBarHeight,
  },
  icon: {
    height: 150,
    width: 150,
  },
  inline: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paragraph: {
    fontSize: 18,
    margin: 24,
    textAlign: 'center',
  },
});
