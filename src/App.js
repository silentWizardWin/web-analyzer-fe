import { useState } from "react";
import './App.css';

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleExtract = async () => {
    setError("");
    setData("");
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error("Failed to extract data.");
      }

      const result = await response.json();
      setData(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Web Analyzer</h1>
      <div className="input-group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="url-input"
        />
        <button
          onClick={handleExtract}
          className="extract-button"
        >
          {loading ? "Extracting..." : "Extract"}
        </button>
      </div>
      {error && <div className="error-text">{error}</div>}
      <textarea
        readOnly
        value={data}
        className="response-textarea"
        placeholder="Extracted data will appear here"
      />
    </div>
  );
}

export default App;
