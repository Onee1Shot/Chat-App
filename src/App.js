import React, { useState,useRef } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';

//Importing an inbuilt firebase hook that will be used for getting user..
import {useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

    firebase.initializeApp(
      {
        //Your Configuration here
        apiKey: "AIzaSyBjTGx-YEJ8sVmlrs7GBRJAXe63IWg4yJM",
        authDomain: "chat-app-9089e.firebaseapp.com",
        projectId: "chat-app-9089e",
        databaseURL: "https:/chat-app-9089e.firebase.com",
        storageBucket: "chat-app-9089e.appspot.com",
        messagingSenderId: "465374511418",
        appId: "1:465374511418:web:11afa6b734642a30ced003",
        measurementId: "G-6FG24T7662"
      }
    )
    const auth = firebase.auth();
    const firestore = firebase.firestore();

    const App = () => {

      const [user] = useAuthState(auth); //This firebse will tell me authentication ithat whether somebody has signed in or not...

      //This is responsible forthe design part of the chat App
  return (
    <>
   
    <div className="App">
      <header>
        <h3>
          To Chaliye Shuru krte hai
        </h3>
        <SignOut/>
      </header>
      <section>
        { user ? <ChatRoom/> : <SignIn/> }
      </section>
    </div>    
    </>
  )
}

function SignIn() {
 
  const SignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
return(
  <>
    <button className='Sign-In' onClick={SignInWithGoogle}>Sign In</button>
    <p>Aoo sab Milke mahol Jamate hai</p>
  </>
)
}


function SignOut() {

  return auth.currentUser && (
    <button className='Sign-Out' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');

  const query = messagesRef.orderBy('createdAt').limit(5000);

  const [messages] = useCollectionData(query,{idFiekld: 'id'});

  const [formValue,setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }


  return(

<>
 <main>

{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

<span ref={dummy}></span>

</main>

<form onSubmit={sendMessage}>

<input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

<button type="submit" disabled={!formValue}>🕊️</button>

</form>

</>)
    
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;