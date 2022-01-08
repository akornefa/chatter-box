# ChatterBox
ChatterBox is a chat app for mobile devices, built using React Native, Gifted Chat and Google Firebase. The app provides users with a chat interface and options to share images and their location.
***
## Key Features
- A page where users can enter their name and choose a background color for the chat screen before joining the chat
- A page displaying the conversation
- Communication features include: sending images and location data
- Can store data online and offline (Users cannot SEND messages when offline and so the input bar is disabled when the user status is offline and will not be visible).
***
## Tech Stack
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Gifted Chat] (https://github.com/FaridSafi/react-native-gifted-chat)
- [Firebase] (https://firebase.google.com/)
***
## Running The App
1. To create and run expo projects you must first install the expo cli using node: npm install expo-cli--global
2. Create a project directory in your chosen location by running: expo init project-name
3. Clone the project files from Github into the local project directory: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
4. Run npm install to install the packages used within the project
5. You will need to create a project in Firebase in order to set up the database for the messages and storage for images. Log in to Firebase using Google credentials, go to the console and click on either Create Project or Add Project, name the project and click create. From the project dashboard select Firestore database and follow the steps (in this simple example we start in test mode so we don't need to worry about configuring database access rules to begin with). Add a collection for messages.
6. Next go to Project Settings and click on the </> icon to register the app. Follow the registration steps. You will then be provided with the code to configure the app and connect it to the project. Use this code to replace the current config object inside the initializeApp function on lines 28-33 of Chat.js (refer to the walkthrough of the Chat component below for more details).
7. Finally, from the project dashboard select Authentication. Click on anonymous and move the slider to "enabled".
8. You can now start the project by running: npm start or expo start (both work)

A new tab will open showing the Metro Bundler, which is an http server that transpiles the app's JavaScript using Babel then serves it to the expo app. Options on the left hand side of the screen will allow you to run the project in an emulator or simulator, or on your phone using the QR code that will be displayed. These options will also appear in your terminal.

To run the project on your phone you must first download expo from the app store before scanning the code provided. To run from an emulator, you must first configure a device using Android Studio; a simulator can alternatively be set up using Xcode.
***
## Walkthrough of key components
* The App.js component is where we determine how we will move between the 2 main screens - specifically the start screen and the chat screen. To code this we use the React Navigation package and its related npm and expo dependencies (a full list of dependencies is contained in the package.json file).

* This app uses stack navigation so we first create a stack then render it inside our return statement wrapped in a navigation container. We then configure the stack with the initial route, then the list of screens with their names and the names of their components. The components are imported at the head of the file. In this case we specify that the default screen to be shown is the start screen.

* The start screen renders an input bar where the user can enter their name, buttons from which the user can select the background colour from a choice of 4 options, and a "Start Chatting" button that will take them to the chat screen. The layout has been created and styled using React Native components, including the keyboard avoiding view, which prevents the input bar being obscured by the phone's keyboard on Android devices. The input bar and buttons have been made accessible to make the app suitable for all users.

* When the "Start Chatting" button is pressed, the onPress function uses the navigation navigate method to take the user to the chat screen, passing the name and background colour as props to the Chat.js component.

* Chat.js renders the Gifted Chat component. As described above, this provides all of the key UI elements such as a message input bar and message bubbles out of the box; these can then be customized via the various properties of that component. In this project a variety of customizations have been made; some are basic changes to the UI (message bubble colour, user name shows next to message) and others to support specific features of the app: the message input bar is only rendered when online, the message input bar contains an Actions button that allows the user to attach images or their location to messages, when a location is sent it is rendered in a map view. In most cases the value of these properties has been set to a function that has then been customized to achieve the desired result.

* Chat.js is a class component and is initialized with a messages state that will hold the messages and a uid and user state to identify the user. As described above, we use Firebase Firestore as the database to hold our messages. Inside the Chat component constructor we link our front end to Firebase using the firebase initializeApp function to which we pass the config object obtained on registering the app (see step 6 in project set up above). We then use the firestore function to create a reference to the collection that we have created for our messages during the set up of our Firestore database.

* When the chat component mounts, we first check the users internet connection status using a package called NetInfo. If the user is connected we update the state to reflect this and proceed to interact with Firebase. We attach a listener to our project that checks for changes in authentication status of the user. If the user is not authenticated we proceed to sign them in as an anonymous user. This returns a user object with which we set the user id state, ensuring the user id in the database matches that in the app. We then attach another listener that in this case listens for changes to our database messages collection. When a change is detected the onSnapshot() method is called which returns a snapshot of the database documents at that point and calls the onCollectionUpate function. This takes the data and pushes it to the messages state in the app. Once the state has been updated the saveMessages function is called which saves the updated messages state to Async Storage. In this way, when the app first loads, all existing messages are uploaded to the state and async storage from the initial snapshot; and each time a subsequent message is sent, both the app state and async storage are updated. This ensures that when the user is connected to the internet, the messages state, database and async storage are in sync at all times.

* If the user is not connected, the app will try to retrieve saved messages from async storage using getMessages. As noted above, if the user first uses the app offline no messages will exist within their async storage therefore a blank screen will be returned. However, after the first time the app is used online, the messages will be available and will display (note that it is never intended that a user can SEND a message while offline, hence why the message input bar is disabled when the "isConnected" state is false).

* When the user is connected they can write and send messages. The onSend function is invoked whenever a message is sent, which takes the current message as its argument. Because we are storing messages in a database, we simply use this function to invoke the addMessage function, passing along the current message object. The addMessages function adds the new message to the messages collection in the database. This in turn triggers the database listener, which returns a new snapshot of the database, invoking the onCollecitonUpdate function and re-setting the messages state and async storage as described above.

* As well as sending text messages, the user can send images or their location. The Gifted Chat property renderActions is used to implement this functionality and we assign this as a value the function renderCustom Actions that returns a Custom Actions component.

* Inside the custom actions component we return a button that invokes the onActionPress function when pressed. This brings up an action sheet listing options that we pass as the first argument to the method showActionSheetWithOptions. The action sheet itself is created by calling actionSheet, and we use React context to share this property (which belongs to Gifted Chat) with the custom actions component. As a second argument to showActionSheetWithOptions we pass an async function that runs a switch statement; depending on the option selected by the user, a function is called to either pick an image, take a photo or send the user's location. A cancel option is set as the default case and closes the aciton sheet.

* Custom functions are invoked for each custom action as described above. These use expo packages with functions to request user permissions to access their gallery/camera/location and, if granted, return the image, picture taken or location as appropriate. More detail is provided in the comments in the CustomActions.js file.

* Images or pictures taken with the camera must be saved to storage prior to sending the message to which they are attached in order for them to be visible to all users in the chat. Firebase provides storage when you set up a project and the function getImageUrl implements the process of saving the image to the storage then retrieving the URL from the storage space so that it can be attached to the message properties. Images are first converted to blobs using the blob method.

* When a location is shared, we want it to display within a map view. Back in the chat component, we use renderCustomView to render a MapView component if a location property has been attached to a message. MapView is imported from the react native maps package.

* Finally, the listeners that we have attached to our database are removed inside the componentWillUnmount function when the app is closed.
***
## A note on Firebase
This project uses Firebase version 7.9.0. Firebase version 9 works with modules whereby only functions needed are imported rather than the whole library, thereby improving performance. All of the functionality in the project can be achieved using version 9 however the syntax used here will need to be adapted in order for the project to run.

The Firebase console is periodically updated by Google to improve useability so the individual steps to set up and configure projects and databases may change from time to time. The steps above are intended as guide based on the process at the time the project was created.
