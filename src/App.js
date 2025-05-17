import { useState } from "react";
import './App.css';

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    try {
      const response = await fetch("http://localhost:8080/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to extract data.");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.message);
      }
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
      <div className="response-display">
        {data ? renderJson(data) : <p className="placeholder-text">Extracted data will appear here</p>}
      </div>
    </div>
  );
}

const renderJson = (obj) => {
  if (typeof obj === "object" && obj !== null) {
    return (
      <ul className="json-block">
        {Object.entries(obj).map(([key, value]) => {
          const formattedKey = key.replace(/_/g, " ");
          return (
            <li key={key} className="json-item">
              <span className="json-key">{formattedKey}:</span>{" "}
              <span className="json-value">
                {typeof value === "object" ? renderJson(value) : value.toString()}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }
  return <span className="json-value">{obj.toString()}</span>;
};

export default App;
