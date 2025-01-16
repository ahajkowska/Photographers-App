"use client";

import React from "react";

export default function Timeline({ deadlines }) {
  // Sort deadlines by date
  const sortedDeadlines = deadlines
    .filter((d) => d.date) // no null dates
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="timeline-container">
      {sortedDeadlines.map((deadline, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-date">
            {new Date(deadline.date).toLocaleDateString()}
          </div>
          <div className="timeline-content">
            <p>{deadline.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
