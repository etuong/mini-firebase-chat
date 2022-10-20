import React, { useRef, useState } from "react";

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import firebaseConfig from "../FirebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AuthenticatedChat = () => {
  const auth = getAuth();
  const [user, setUser] = useState();

  const SignIn = () => {
    const signInWithPassword = () => {
      createUserWithEmailAndPassword(auth, "email", "password").then(
        (userCredential) => setUser(userCredential.user)
      );
    };

    return (
      <button className="sign-in" onClick={signInWithPassword}>
        Sign In
      </button>
    );
  };

  const SignOut = () => {
    return (
      auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>
          Sign Out
        </button>
      )
    );
  };

  const ChatRoom = async () => {
    const dummy = useRef();
    // const messagesRef = firestore.collection("messages");
    // const query = messagesRef.orderBy("createdAt").limit(25);
    const [messages, setMessages] = useState([]);

    const querySnapshot = await getDocs(collection(db, "messages"));
    querySnapshot.forEach((doc) => {
      setMessages(doc.data());
    });

    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
      e.preventDefault();

      const { uid } = auth.currentUser;
      await addDoc(collection(db, "messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
      });

      setFormValue("");
      dummy.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
      <>
        <main>
          {messages?.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          <span ref={dummy}></span>
        </main>

        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Type message here..."
          />

          <button type="submit" disabled={!formValue}>
            Send
          </button>
        </form>
      </>
    );
  };

  const ChatMessage = (props) => {
    const { text, uid } = props.message;

    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

    return (
      <>
        <div className={`message ${messageClass}`}>
          <p>{text}</p>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <header>
        <h1>Engineering Chat!</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
};

export default AuthenticatedChat;
