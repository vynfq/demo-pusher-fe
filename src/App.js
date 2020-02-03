import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Pusher from 'pusher-js';
import ChatList from './components/ChatList';
import ChatBox from './components/ChatBox';

function App() {
  const [chatInfo, setChatInfo] = useState({
    text: '',
    username: '',
    chats: []
  });
  const handleTextChange = (e) => {
    if (e.keyCode === 13) {
      const payload = {
        username: chatInfo.username,
        message: chatInfo.text
      };
      axios.post('http://localhost:5000/message', payload);
    } else {
      setChatInfo({...chatInfo, text: e.target.value })
    }
  }
  useEffect(() => {
    setChatInfo(c => ({...c, username: window.prompt('Username: ', 'Anonymous')}));
    const pusher = new Pusher('b8585128683247f88e99', {
      cluster: 'ap1',
      encrypted: true
    });
    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      console.log(data)
      setChatInfo(c => ({ ...c, chats: [...c.chats, data], test: '' }))
    });
  }, []);

  return (
    <div className="App">
      <section>
        <ChatList chats={chatInfo.chats} />
        <ChatBox
          text={chatInfo.text}
          username={chatInfo.username}
          handleTextChange={handleTextChange}
        />
      </section>
    </div>
  );
}

export default App;
