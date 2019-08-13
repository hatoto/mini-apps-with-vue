import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'


export interface FirebaseConfig
{
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string
}

//create a config file named 'firebaseConfig.json' in same directory
var firebaseConfig : FirebaseConfig = require('./firebaseConfigData.json');

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.auth().signInAnonymously();
firebaseApp.auth().onAuthStateChanged(function(user) {
  if (user) {    
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
  } else {
    
  }  
});

export default firebaseApp.firestore();