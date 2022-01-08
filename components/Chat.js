import React from 'react';
import { View, Text, Button, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';


const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor(props) {
    super();
    this.state = {
      messages: [],
      uid: 0,
      loggedInText: 'Please wait. You are being authenticated',
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
      image: null,
      location: null,
    };

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCWJjElTdb-WgJ653szfu548kjP24cwVHA",
        authDomain: "chatterbox-e9340.firebaseapp.com",
        projectId: "chatterbox-e9340",
        storageBucket: "chatterbox-e9340.appspot.com",
        messagingSenderId: "213702840329",
      });
    }
    // reference to the Firestore message collection
    this.referenceChatMessages = firebase.firestore().collection("messages");

  }

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {

        this.setState({ isConnected: true });
        console.log('online');

        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          };
          //update user state with currently active user data
          this.setState({
            uid: user.uid,
            messages: [],
            loggedInText: 'You are logged in!',
            user: {
              _id: user.uid,
              name: name,
              avatar: "https://placeimg.com/140/140/any",
            }
          });
        });
        this.saveMessages();

      } else {
        this.setState({ isConnected: false });
        this.getMessages();
        console.log('offline');
      }
    });

  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  }

  addMessage(message) {
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
    });
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  //change message bubble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }


  render() {

    let { bkgColor } = this.props.route.params;
    return (
      <View style={[styles.container, { backgroundColor: bkgColor }]}>
        <Text>{this.state.loggedInText}</Text>
        <View style={styles.giftedChat}>
          <GiftedChat
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={this.state.user}
            renderActions={this.renderCustomActions}
            renderCustomView={this.renderCustomView}
          />
          <Button
            title='Go to Start'
            onPress={() => this.props.navigation.navigate('Start')}
          />
          {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  giftedChat: {
    flex: 1,
    width: '88%',
    paddingBottom: 10
  }
});