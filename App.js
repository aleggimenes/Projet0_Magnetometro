import { Magnetometer } from 'expo-sensors';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TouchableOpacity, View,
         Image, Animated, title } from 'react-native';
import {AppLoading} from 'expo'
import * as Font from 'expo-font'
import { loadAsync } from 'expo-font';

export default function Compass() {

  const [data, setData] = React.useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [offset] = useState(new Animated.ValueXY({x: 0, y: 95}));
  const [opacity] = useState(new Animated.Value(0));
  useEffect(()=> {
    Animated.parallel([
      Animated.spring(offset.y, {
        useNativeDriver: true,
        toValue: 0,
        speed: 2,
        bouciness: 30
      }),
      Animated.timing(opacity, {
        useNativeDriver: true,
        toValue: 1,
        duration:200,
      })
    ]).start();
  }, []);
  
  const [subscription, setSubscription] = React.useState(null);

  React.useEffect(() => {
    _toggle();
    return () => {
      _unsubscribe();
    };
  }, []);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _slow = () => {
    Magnetometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Magnetometer.setUpdateInterval(16);
  };

  const _normal = () => {
    Magnetometer.setUpdateInterval(150);
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(result => {
        setData(result);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const { x, y, z } = data;
  return (
    <View style={styles.sensor} >
       <View>
       <Text style={styles.TextTitle}>Magnetômetro</Text>
       </View>
       
       <Image
        style={styles.Imagem}
        source={require('./assets/Magneto.png')} 
        />
         <Animated.View 
      style={[
        styles.sensor,
      {
        opacity: opacity,
        transform: [
          { translateY: offset.y }
        ]
      }
    ]}
      >
      <View style={styles.TextTitle}>
      <Text style={styles.TextButton}> 
        X: {round(x)}  Y: {round(y)}  Z: {round(z)}
      </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={_toggle} style={styles.buttonAlt}>
        <Text style={styles.TextButton}>Alternar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
        <Text style={styles.TextButton}>Devagar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_normal} style={styles.buttonNorm}>
        <Text style={styles.TextButton}>Normal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.buttonRap}>
        <Text style={styles.TextButton}>Rápido</Text>
        </TouchableOpacity>
      </View>
      </Animated.View>
      </View>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
    fontWeight: 'bold',
    backgroundColor: '#595eaa',
    marginBottom: 300
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#595eaa',
    padding: 10,
    fontWeight: 'bold',
    borderRadius: 0
  },
  buttonAlt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#595eaa',
    padding: 10,
    fontWeight: 'bold',
    borderColor: '#fff',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  buttonRap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#595eaa',
    padding: 10,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },

  buttonNorm:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#595eaa',
    padding: 10,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff',
  },

  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff',
    fontWeight: 'bold',
  },
  sensor: {
    paddingHorizontal: 10,
    backgroundColor: '#595eaa',
  },
  Imagem: {
    width: 370,
    height: 500,
    resizeMode: 'center',
    borderRadius: 210,
  },
  Text:{
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#fff'
  },
  TextButton:{
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#fff'
  },
  TextTitle:{
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    marginTop: 80
  }
});

