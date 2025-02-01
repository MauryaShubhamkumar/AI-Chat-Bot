import { useState } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SyncLoader from "react-spinners/SyncLoader";

function App() {
  const apiKey = import.meta.env.VITE_API_GEMINI_KEY;

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchChatResponseFromGemini() {
    if (!prompt.trim()) return; // Prevent empty prompts
    setLoading(true);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent(prompt);
      setResponse([
        ...response,
        { prompt: prompt, response: result.response.text() },
      ]);
      setPrompt("");
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse([
        ...response,
        { prompt: prompt, response: "Failed to fetch response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="heading">AI Chat Bot</h1>
      <h2>Hi, I'm SKM.</h2>
      <p>How can i help you today?</p>
     
      <div className="chatbot_container">
        <div className="chatbot_response_container">
          {response.map((res, index) => (
            <div key={index} className="message">
              <p className="chatbot_prompt">
                <strong>User :</strong> {res.prompt}
              </p>
              <p className="chatbot_response">
                <strong>Chatbot :</strong> {res.response}
              </p>
            </div>
          ))}
          {loading && (
            <div className="loader">
              <SyncLoader color="#1877F2" loading={loading} size={10} />
            </div>
          )}
        </div>
        <div className="chatbot_input">
          <input
            type="text"
            name="input"
            placeholder="Ask me anything..."
            className="input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && fetchChatResponseFromGemini()}
          />
          <button type="button" onClick={fetchChatResponseFromGemini}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default App;