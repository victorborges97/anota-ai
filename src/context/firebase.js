import React, { createContext, useContext, useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, onValue, child, get, update, remove } from "firebase/database";

import { LoginLocalStorage } from '../Utils';

export const USER = "@USER";
export const TOKEN = "@TOKEN";

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

// we create a React Context, for this to be accessible
// from a component later
const FirebaseContext = createContext();

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);
export const auth = getAuth();

export default function FirebaseProvider({ children }) {

    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                LoginLocalStorage(user);

                onUserData(user.uid);
                // ...
            } else {
                // User is signed out
                // ...
                LogoutLocalStorage();
            }
        });
    }, [])

    function writeUserData(userId, userInfor) {
        set(ref(database, 'users/' + userId), userInfor);
    }
    function onUserData(userId) {
        let user = {};
        const userRef = ref(database, 'users/' + userId);
        onValue(userRef, (snapshot) => {
            user = snapshot.val();
            setUser(user)
        });
    }
    function getUserData(userId) {
        return getDb("users/" + userId);;
    }

    let authenticated = {
        // getDisciplinas,
        // addDisciplina,
        // updateDisciplina,
        // deleteDisciplina,

        registerEmail,
        loginEmail,
        logoutEmail,
    }

    const isAuthenticated = () => localStorage.getItem(TOKEN) !== null ? true : false;


    //LOGIN E LOGOUT
    async function getDb(path) {
        return get(child(dbRef, `${path}`));
    }
    async function reDb(path) {
        remove(child(dbRef, `${path}`))
    }
    async function upDb(path, updates) {
        update(child(dbRef, `${path}`), updates);
    }
    async function onDb(path, callback) {
        onValue(child(dbRef, `${path}`), callback);
    }
    async function setDb(path, data) {
        set(child(dbRef, `${path}`), data);
    }

    //LOGIN, LOGOUT E REGISTER
    async function registerEmail(nome, email, senha) {
        if (nome === null || nome === "") {
            throw new Error({ message: 'Nome está faltando' });
        }

        if (email === null || email === "") {
            throw new Error({ message: 'E-mail está faltando' });
        }
        if (senha === null || senha === "") {
            throw new Error({ message: 'Senha está faltando' });
        }

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, senha);

            if (user) {

                const userInfor = {
                    "uid": user.uid,
                    "photoURL": user.photoURL,
                    "phoneNumber": user.phoneNumber,
                    "email": user.email,
                    "displayName": nome,
                    "refreshToken": user.refreshToken,
                }

                LoginLocalStorage(userInfor);

                writeUserData(
                    userInfor.uid,
                    {
                        "uid": user.uid,
                        "photoURL": user.photoURL,
                        "phoneNumber": user.phoneNumber,
                        "email": user.email,
                        "displayName": nome,
                    }
                )

                setUser(userInfor)

            }
        } catch (error) {
            throw new Error(error);
        }
    }
    async function loginEmail(email, senha) {
        if (email === null || email === "") {
            throw new Error({ message: 'E-mail está faltando' });
        }
        if (senha === null || senha === "") {
            throw new Error({ message: 'Senha está faltando' });
        }

        try {
            const { user } = await signInWithEmailAndPassword(auth, email, senha);

            if (user) {

                let userData = await getUserData(user.uid);

                const userInfor = {
                    "uid": user.uid,
                    "photoURL": userData.photoURL,
                    "phoneNumber": userData.phoneNumber,
                    "email": userData.email,
                    "displayName": userData.displayName,
                    "refreshToken": user.refreshToken,
                }

                LoginLocalStorage(userInfor);
                setUser(userInfor)

            }
        } catch (error) {
            throw new Error(error);
        }
    }
    function logoutEmail() {
        auth.signOut();
        setUser(null);
        LogoutLocalStorage();
    }
    const LogoutLocalStorage = () => {
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(USER);
    };

    //LOGIN E LOGOUT

    return (
        <FirebaseContext.Provider value={{
            auth,
            authenticated,
            database,
            isAuthenticated,
            user,
            setUser,
            getDb,
            setDb,
            onDb,
            upDb,
            reDb,
        }}>
            {children}
        </FirebaseContext.Provider>
    )
}

export function useFirebase() {
    const context = useContext(FirebaseContext);
    if (!context)
        throw new Error("useUser must be used within a Context.Provider");
    const {
        auth,
        authenticated,
        database,
        isAuthenticated,
        user,
        getDb,
        setDb,
        onDb,
        upDb,
        reDb,
    } = context;
    return {
        auth,
        authenticated,
        database,
        isAuthenticated,
        user,
        getDb,
        setDb,
        onDb,
        upDb,
        reDb,
    };
}
