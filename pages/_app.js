import "../styles/globals.css";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtgnnmjOSFKX4MRvvMNGIcyHKk2nX5jns",
  authDomain: "college-cms-64756.firebaseapp.com",
  projectId: "college-cms-64756",
  storageBucket: "college-cms-64756.appspot.com",
  messagingSenderId: "25898947539",
  appId: "1:25898947539:web:596feeb072cb92763b9526",
  measurementId: "G-J5KNCBXPTN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "../app/store";
import { createUser } from "../firebase/user.firebase";

export const authContext = createContext(null);

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      async (userCredentials) => {
        if (userCredentials) {
          const newUser = {
            uid: userCredentials.uid,
            email: userCredentials.email,
            displayName: userCredentials.displayName,
            emailVerified: userCredentials.emailVerified,
            isAnonymous: userCredentials.isAnonymous,
            phoneNumber: userCredentials.phoneNumber,
            photoURL: userCredentials.photoURL,
            role: userCredentials.role || "user",
            active: false,
            metadata: {
              createdAt: userCredentials.metadata.createdAt,
              creationTime: userCredentials.metadata.creationTime,
              lastLoginAt: userCredentials.metadata.lastLoginAt,
              lastSignInTime: userCredentials.metadata.lastSignInTime,
            },
          };
          console.log(userCredentials);
          const savedUser = await createUser(newUser);
          setUser(savedUser);
        } else {
          setUser(null);
        }
      }
    );
    return () => unsubscribe();
  }, []);
  return (
    <authContext.Provider value={user}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </authContext.Provider>
  );
}

export default MyApp;
