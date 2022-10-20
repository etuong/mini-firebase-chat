import React, { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import firebaseConfig from "../FirebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
  const [user, setUser] = useState();

  const SignIn = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setUser(document.getElementById("name").value);
        }}
      >
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your name"
        />
        <input type="submit" value="Submit" />
      </form>
    );
  };

  const ChatRoom = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      const unsubscribe = onSnapshot(
        query(collection(db, "messages"), orderBy("createdAt", "asc")),
        (querySnapshot) => {
          const snapshot = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setMessages(snapshot);
        }
      );

      return () => {
        unsubscribe();
      };
    }, []);

    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
      e.preventDefault();

      await addDoc(collection(db, "messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: "asd",
      });

      setFormValue("");
    };

    return (
      <>
        <main>
          {messages?.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
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
    const messageClass = uid === user ? "sent" : "received";

    return (
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    );
  };

  return (
    <div className="App">
      <header>
        <h1>Engineering Chat!</h1>
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
};

export default App;
