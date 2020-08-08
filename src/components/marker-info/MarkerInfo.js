import React, { useState, useEffect, memo,useRef } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, Pressable } from 'react-native';
import axios from 'axios';

const MarkerInfoContainer = ({ key, coordinate, ...props }) => {
  const [location, setLocation] = useState('Kyiv, Ukraine');
  const [temperature, setTemperature] = useState('+1C');
  const ref = useRef();
  const [loaded, setLoaded] = useState(false);

  let url = `http://api.weatherstack.com/current?access_key=a0511487d6eb5967bad5b78dc1525142&query=${coordinate.latitude},${coordinate.longitude}`;

  const setNewWeather = () => {
    console.log("setNewWeather");
    setLoaded(false)

    axios.get(url)
      .then(res => {
        // console.log(res.data);
        setLocation("mmm");
        setTemperature(Math.random());
      })
      .catch(err => console.log(err))
      .finally(()=>{setLoaded(true);redraw()}
      )
  }

  const redraw = () => {
    if (ref && ref.current && ref.current.redrawCallout) {
      console.log('redraw');
      ref.current.redrawCallout();
    }
  }

  useEffect(() => {
    console.log("MarkerInfoContainer effect")
    setNewWeather();
  },[]);

  // useEffect(()=>{
  //   console.log('[location,temperature]')
  // },[location,temperature,loaded])

  return <MarkerInfo
    {...props}
    ref={ref}
    coordinate={coordinate}
    location={location}
    temperature={temperature}
    onPress={setNewWeather}
    key={key}
    loaded={loaded}
    />;
};

const MarkerInfo = React.forwardRef(({  location, temperature, onPress,loaded,...props }, ref) => {
  return (
    <Marker
      {...props}
      onPress={onPress}
      ref={ref}
    >
      <Callout style={{width:200, height:50}} onPress={()=> console.log("callout pressed")}>
        {
          loaded ? <View style={{width:200}}>
          <Text>
            {location}
          </Text>
          <Text>
            {temperature}
          </Text>
        </View> :
        <Text>Loading...</Text>
        }
      </Callout>
    </Marker>
  );
});

export default memo(MarkerInfoContainer);
