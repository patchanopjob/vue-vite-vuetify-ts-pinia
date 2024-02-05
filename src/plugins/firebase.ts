import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZNgW-1LR3VHxB5tyafTEVKSYMIDOUQsw",
  authDomain: "vue-vite-ts-vuetify-7a9ff.firebaseapp.com",
  projectId: "vue-vite-ts-vuetify-7a9ff",
  storageBucket: "vue-vite-ts-vuetify-7a9ff.appspot.com",
  messagingSenderId: "994245420213",
  appId: "1:994245420213:web:d605380633640d3c8c4afc",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

export { storage, db };
