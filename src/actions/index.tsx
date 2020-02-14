const fetchWeatherForLocation = location => {
  if(!location || !location.coords) {
    return Promise.reject('Error getting weather for your location. Please try again.');
  }
  return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=imperial&appid=3b6ab1b7e63545812e6ca60a28028d9b`)
    .then(response => response.json())
    .then(responseJson => {
      if(responseJson.cod === 200) {
        // console.log('responseJson',responseJson);
        let dataObj = {
          city: responseJson.name,
          details: responseJson.weather[0] || {},
          feels_like: responseJson.main.feels_like,
          humidity: responseJson.main.humidity,
          temp: responseJson.main.temp,
          temp_max: responseJson.main.temp_max,
          temp_min: responseJson.main.temp_min,
        };
        return Promise.resolve(dataObj);
      }
      return Promise.reject('Error getting weather for your location. Please try again.');
    })
    .catch(error => Promise.reject('Error getting weather for your location. Please try again.'));
};

export default {
  fetchWeatherForLocation,
};
