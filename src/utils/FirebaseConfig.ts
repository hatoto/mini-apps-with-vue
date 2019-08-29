import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import * as configdata from './firebaseConfigData.json'

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
//dataformat in firebaseConfig.json
/**
  {
   "data":{
      "apiKey": "xxxxxx",
      "authDomain": "xxxx.firebaseapp.com",
      ......
    }
  } 
  
 */

var firebaseConfig : FirebaseConfig = <FirebaseConfig>configdata.data;

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