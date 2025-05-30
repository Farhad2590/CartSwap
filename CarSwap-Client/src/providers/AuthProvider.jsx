import { createContext, useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import { toast } from "react-toastify";

export const AuthContext = createContext(null)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const signInWithGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }
    const resetPassword = email => {
        setLoading(true)
        return sendPasswordResetEmail(auth, email)
    }
    const logOut = async () => {
        setLoading(true);
        return signOut(auth)
            .then(() => {
                toast.success("Logout successful");
            })
            .catch((error) => {
                toast.error(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photo,
        })
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
          setUser(currentUser)
          setLoading(false)
        })
        return () => {
          return unsubscribe()
        }
      }, [])
      const authInfo = {
        user,
        loading,
        setLoading,
        createUser,
        signIn,
        signInWithGoogle,
        resetPassword,
        logOut,
        updateUserProfile,
      }
    

    return (
        <AuthContext.Provider value={authInfo}>
        {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;