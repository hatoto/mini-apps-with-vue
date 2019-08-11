import firebase from 'firebase/app';
import 'firebase/firestore'


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

//create a config file in 'firebaseConfig.json'
var firebaseConfig : FirebaseConfig = require('./firebaseConfigData.json');

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();