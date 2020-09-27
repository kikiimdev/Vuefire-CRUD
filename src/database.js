import firebase from 'firebase/app'
import 'firebase/firestore'

// Get a Firestore instance
export const db = firebase
  .initializeApp({
    apiKey: "AIzaSyA7YMAU-zLWb9ex2con-wmmsMZfdgMnsok",
    authDomain: "crud-af785.firebaseapp.com",
    databaseURL: "https://crud-af785.firebaseio.com",
    projectId: "crud-af785",
    storageBucket: "crud-af785.appspot.com",
    messagingSenderId: "921136564866",
    appId: "1:921136564866:web:8272d2dd234d251f30c29b"
  })
  .firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }