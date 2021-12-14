import React from 'react';
import { View, Text, Button, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

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


  componentDidMount() {

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

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

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

    this.setState({
      messages: [],
    })
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
        }
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
      user: message.user
    });
  }

  onSend(messages = []) {
    this.addMessage(messages[0]);
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

  render() {

    let { bkgColor } = this.props.route.params;
    return (
      <View style={[styles.container, { backgroundColor: bkgColor }]}>
        <Text>{this.state.loggedInText}</Text>
        <View style={styles.giftedChat}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={this.state.user}
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