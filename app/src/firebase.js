import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDCQk416cA2uyimEAtxB8R3c7grnCe4KSw",
    authDomain: "vue-blog-4e99d.firebaseapp.com",
    projectId: "vue-blog-4e99d",
    storageBucket: "vue-blog-4e99d.appspot.com",
    messagingSenderId: "1028569081722",
    appId: "1:1028569081722:web:646104bcab45a13b1798c3"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');
const commentsCollection = db.collection('comments');
const likesCollection = db.collection('likes');

export {
    db,
    auth,
    usersCollection,
    postsCollection,
    commentsCollection,
    likesCollection
};
