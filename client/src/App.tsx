import { useEffect, useState } from "react";
import { socket } from "./socket";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!message) return;

    socket.emit("send_message", {
      room: "general",
      message,
    });

    setMessage("");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Slack Clone</h2>
        <p># general</p>
      </aside>

      <main className="chat">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className="message">
              {msg}
            </div>
          ))}
        </div>

        <div className="inputArea">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </main>
    </div>
  );
}

export default App;