import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import bkimg from '../assets/bkimg.png'


export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bkgColor: '',
    };
  }
  changeBkgColor = (newColor) => {
    this.setState({ bkgColor: newColor });
  };

  colors = {
    black: '#090C08',
    plum: '#474056',
    gray: '#8A95A5',
    green: '#B9C6AE'
  }


  render() {

    return (
      <View style={styles.container}>
        <ImageBackground
          source={bkimg}
          resizeMode='cover'
          style={styles.bgImage}>
          <Text
            style={styles.h1}>ChatterBox</Text>
          <View style={styles.box}>
            <TextInput
              style={styles.inputBox}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Type here ...'
            />

            <View style={styles.colorSwatch}>
              <Text style={styles.subtitle}>Choose Backgroud Color</Text>
              <View style={styles.swatches}>
                <TouchableOpacity
                  onPress={() => this.changeBkgColor(this.colors.black)}
                >
                  <View style={styles.circle1}></View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.changeBkgColor(this.colors.plum)}
                >
                  <View style={styles.circle2}></View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.changeBkgColor(this.colors.gray)}
                >
                  <View style={styles.circle3}></View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.changeBkgColor(this.colors.green)}
                >
                  <View style={styles.circle4}></View>
                </TouchableOpacity>
              </View>
            </View>
            <Button
              style={styles.btn}
              title='Start Chatting'
              color='#757083'
              onPress={() => this.props.navigation.navigate('Chat', {
                name: this.state.name,
                bkgColor: this.state.bkgColor,
              })
              }
            />
          </View>
        </ImageBackground>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h1: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 45,
    fontWeight: "800",
    color: "#fff",
    paddingTop: 60,
    marginTop: 20,
  },
  bgImage: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  box: {
    backgroundColor: "white",
    flexGrow: 1,
    flexShrink: 0,
    width: "88%",
    marginBottom: 30,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 30,
    height: 260,
    minHeight: 260,
    maxHeight: 290,
    borderRadius: 10,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 50,
    maxHeight: 50,
    width: '88%',
    borderColor: 'gray',
    borderWidth: 2,
    padding: 5,
    fontWeight: '300',
    fontSize: 16,
    opacity: .5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: "#757083",
    opacity: 1,
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    backgroundColor: '#6705e9',
  },
  swatches: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorSwatch: {
    flex: 1,
    padding: 20,
  },
  circle1: {
    width: 40,
    height: 40,
    backgroundColor: "#090C08",
    borderRadius: 40,
  },
  circle2: {
    width: 40,
    height: 40,
    backgroundColor: "#474056",
    borderRadius: 40,
  },
  circle3: {
    width: 40,
    height: 40,
    backgroundColor: "#8A95A5",
    borderRadius: 40,
  },
  circle4: {
    width: 40,
    height: 40,
    backgroundColor: "#B9C6AE",
    borderRadius: 40,
  }
});