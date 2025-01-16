"use client";

import { useState } from "react";
import {
  generateLocation,
  generatePerson,
  generateColor,
  generateTheme,
} from "../../lib/ideaGenerators";

export default function IdeaGeneratorPage() {
  const [generatedLocation, setGeneratedLocation] = useState("");
  const [generatedPerson, setGeneratedPerson] = useState("");
  const [generatedColor, setGeneratedColor] = useState("");
  const [generatedTheme, setGeneratedTheme] = useState("");

  return (
    <div className="idea-generator-page">
      <h1>Idea Generator</h1>
      <p>Spark yourk creativity or overcome your creative blocks generating random suggestions for various elements of a shoot</p>

      <div className="generator-section">
        <h2>Generate a Random Location</h2>
        <button onClick={() => setGeneratedLocation(generateLocation())}>
          Generate Location
        </button>
        {generatedLocation && <p>Location: {generatedLocation}</p>}
      </div>

      <div className="generator-section">
        <h2>Generate a Random Subject</h2>
        <button onClick={() => setGeneratedPerson(generatePerson())}>
          Generate Subject
        </button>
        {generatedPerson && <p>Subject: {generatedPerson}</p>}
      </div>

      <div className="generator-section">
        <h2>Generate a Random Color</h2>
        <button onClick={() => setGeneratedColor(generateColor())}>
          Generate Color
        </button>
        {generatedColor && (
          <div style={{ backgroundColor: generatedColor, color: "#fff", padding: "10px", marginTop: "10px" }}>
            Color: {generatedColor}
          </div>
        )}
      </div>

      <div className="generator-section">
        <h2>Generate a Random Theme</h2>
        <button onClick={() => setGeneratedTheme(generateTheme())}>
          Generate Theme
        </button>
        {generatedTheme && <p>Theme: {generatedTheme}</p>}
      </div>
    </div>
  );
}
