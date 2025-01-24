"use client";

import { useState, useEffect } from "react";
import {
  generateLocation,
  generatePerson,
  generateColor,
  generateTheme,
  generateChallenge,
} from "../../lib/ideaGenerators";

export default function IdeaGeneratorPage() {
  const [generatedLocation, setGeneratedLocation] = useState("");
  const [generatedPerson, setGeneratedPerson] = useState("");
  const [generatedColor, setGeneratedColor] = useState("");
  const [generatedTheme, setGeneratedTheme] = useState("");
  const [generatedChallenge, setGeneratedChallenge] = useState("");
  const [generatedSentence, setGeneratedSentence] = useState("");

  const updateGeneratedSentence = () => {
    const sentence = `During your next session, you will shoot ${generatedPerson || "a subject"} at ${
      generatedLocation || "a location"
    }, focusing on a ${generatedTheme || "theme"}. 
    Make sure to incorporate the color ${generatedColor || "a color"} and take on the challenge: "${
      generatedChallenge || "a challenge"
    }."`;
    setGeneratedSentence(sentence);
  };

  useEffect(() => {
    updateGeneratedSentence();
  }, [generatedLocation, generatedPerson, generatedColor, generatedTheme, generatedChallenge]);

  const handleGenerateAll = () => {
    const location = generateLocation();
    const person = generatePerson();
    const color = generateColor();
    const theme = generateTheme();
    const challenge = generateChallenge();
  
    // Zaktualizuj wszystkie stany
    setGeneratedLocation(location);
    setGeneratedPerson(person);
    setGeneratedColor(color);
    setGeneratedTheme(theme);
    setGeneratedChallenge(challenge);
  };
  
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

      <div className="generator-section">
        <h2>Generate a Random Challenge</h2>
        <button onClick={() => setGeneratedChallenge(generateChallenge())}>
          Generate Challenge
        </button>
        {generatedChallenge && <p>Challenge: {generatedChallenge}</p>}
      </div>

      <div className="generator-section">
        <h2>Generate Everything</h2>
        <button onClick={handleGenerateAll}>Generate All</button>
      </div>

      {generatedSentence && (
        <div className="generated-sentence">
          <h3>Your Next Session:</h3>
          <p>{generatedSentence}</p>
        </div>
      )}
    </div>
  );
}
