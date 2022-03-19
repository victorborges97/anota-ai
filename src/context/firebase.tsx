import React, { createContext, useContext, useEffect, useState } from "react";
import {
  FirebaseApp,
  FirebaseError,
  getApps,
  initializeApp,
} from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  Auth,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  get,
  update,
  remove,
  query,
  orderByChild,
  DataSnapshot,
  Database,
} from "firebase/database";

import { LoginLocalStorage } from "../Utils";

export const USER = "@USER";
export const TOKEN = "@TOKEN";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export type UserInfor = {
  uid: string;
  photoURL?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  email?: string | null | undefined;
  displayName?: string;
  refreshToken: string;
};

export type ContextProps = {
  auth: Auth;
  authenticated: {
    registerEmail: (
      nome: string,
      email: string,
      senha: string
    ) => Promise<void>;
    loginEmail: (email: string, senha: string) => Promise<void>;
    logoutEmail: () => Promise<void>;
  };
  database: Database;
  isAuthenticated: () => boolean;
  user: UserInfor | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfor | null>>;
  getDb: (path: string) => Promise<DataSnapshot>;
  setDb: (path: string, data: any) => Promise<void>;
  onDb: (
    path: string,
    callback: (snapshot: DataSnapshot) => void,
    orderBy?: string
  ) => Promise<void>;
  upDb: (path: string, updates: object) => Promise<void>;
  reDb: (path: string) => Promise<void>;
  getDbOrdeBy: (path: string, orderBy: string) => Promise<DataSnapshot>;
};

const FirebaseContext = createContext<ContextProps | undefined>(undefined);

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const database = getDatabase(app);
const dbRef = ref(database);
export const auth = getAuth();

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserInfor | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        LoginLocalStorage(user);

        await getUserData(user.uid).then((userData) => {
          let info = userData.val();
          const userInfor: UserInfor = {
            uid: `${user.uid}`,
            photoURL: `${info.photoURL}`,
            phoneNumber: `${info.phoneNumber}`,
            email: `${info.email}`,
            displayName: `${info.displayName}`,
            refreshToken: `${user.refreshToken}`,
          };

          LoginLocalStorage(userInfor);
          setUser(userInfor);
        });

        // ...
      } else {
        // User is signed out
        // ...
        LogoutLocalStorage();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function writeUserData(userId: string, userInfor: UserInfor) {
    set(ref(database, "users/" + userId), userInfor);
  }

  function getUserData(userId: string) {
    return getDb("users/" + userId);
  }

  let authenticated = {
    registerEmail,
    loginEmail,
    logoutEmail,
  };

  const isAuthenticated = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN) !== null ? true : false;
    } else {
      return false;
    }
  };

  //LOGIN E LOGOUT
  async function getDb(path: string) {
    return get(child(dbRef, `${path}`));
  }
  async function getDbOrdeBy(path: string, orderBy: string) {
    return get(query(child(dbRef, `${path}`), ...[orderByChild(orderBy)]));
  }
  async function reDb(path: string) {
    remove(child(dbRef, `${path}`));
  }
  async function upDb(path: string, updates: object) {
    update(child(dbRef, `${path}`), updates);
  }
  async function onDb(
    path: string,
    callback: (snapshot: DataSnapshot) => void,
    orderBy?: string
  ) {
    console.log(orderBy !== undefined);
    if (orderBy !== undefined) {
      console.log("Com orderBy: " + orderBy);
      onValue(
        query(child(dbRef, `${path}`), ...[orderByChild(orderBy)]),
        callback
      );
    } else {
      console.log("Sem orderBy: " + orderBy);
      onValue(child(dbRef, `${path}`), callback);
    }
  }
  async function setDb(path: string, data: any) {
    set(child(dbRef, `${path}`), data);
  }

  //LOGIN, LOGOUT E REGISTER
  async function registerEmail(nome: string, email: string, senha: string) {
    if (nome === null || nome === "") {
      throw new Error("Nome está faltando");
    }

    if (email === null || email === "") {
      throw new Error("E-mail está faltando");
    }
    if (senha === null || senha === "") {
      throw new Error("Senha está faltando");
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      ).catch((err: FirebaseError) => {
        throw new Error(err.code);
      });

      if (user) {
        const userInfor: UserInfor = {
          uid: user.uid,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          email: user.email,
          displayName: nome,
          refreshToken: user.refreshToken,
        };

        LoginLocalStorage(userInfor);

        writeUserData(userInfor.uid, {
          uid: user.uid,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          email: user.email,
          displayName: nome,
          refreshToken: user.refreshToken,
        });

        setUser(userInfor);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async function loginEmail(email: string, senha: string) {
    if (email === null || email === "") {
      throw new Error("E-mail em branco!");
    }
    if (senha === null || senha === "") {
      throw new Error("Senha em branco!");
    }

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      ).catch((err: FirebaseError) => {
        throw new Error(err.code);
      });

      if (user) {
        await getUserData(user.uid).then((userData) => {
          let info = userData.val();
          const userInfor = {
            uid: `${user.uid}`,
            photoURL: `${info.photoURL}`,
            phoneNumber: `${info.phoneNumber}`,
            email: `${info.email}`,
            displayName: `${info.displayName}`,
            refreshToken: `${user.refreshToken}`,
          };

          LoginLocalStorage(userInfor);
          setUser(userInfor);
        });
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
  function logoutEmail() {
    return auth.signOut().then((_) => {
      setUser(null);
      LogoutLocalStorage();
    });
  }
  const LogoutLocalStorage = () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
  };

  //LOGIN E LOGOUT

  return (
    <FirebaseContext.Provider
      value={{
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
        getDbOrdeBy,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useUser must be used within a Context.Provider");
  }

  return context;
}
