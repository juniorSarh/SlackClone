import { useEffect, useState } from "react";
import { socket } from "./socket";
import "./App.css";

const channels = ["general", "random", "dev", "design"];

function App() {
  const [currentChannel, setCurrentChannel] = useState("general");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [username, setUsername] = useState("");
const [joined, setJoined] = useState(false);

  // Join room when channel changes
  useEffect(() => {
    socket.emit("join_room", currentChannel);
    setMessages([]); // clear messages when switching channels
  }, [currentChannel]);

  // Listen for messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.room === currentChannel) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [currentChannel]);

  const sendMessage = () => {
    if (!message) return;

    socket.emit("send_message", {
      room: currentChannel,
      message,
      username,
    });

    setMessage("");
  };

  if (!joined) {
  return (
    <div className="join">
      <h2>Enter Username</h2>
      <input
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your name..."
      />
      <button onClick={() => setJoined(true)}>Join Chat</button>
    </div>
  );
}

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Channels</h2>

        {channels.map((ch) => (
          <p
            key={ch}
            onClick={() => setCurrentChannel(ch)}
            className={currentChannel === ch ? "active" : ""}
          >
            # {ch}
          </p>
        ))}
      </aside>

      {/* Chat */}
      <main className="chat">
        <h3 className="header">#{currentChannel}</h3>

        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className="message">
              {msg}
            </div>
          ))}
        </div>

        <div className="inputArea">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </main>
    </div>
  );
}

export default App;