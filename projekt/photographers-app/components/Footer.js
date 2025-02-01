import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&#169; 2025 Photographer's App.</p>
        <div className="social-icons">
          <a href="https://facebook.com">
            <img src="/assets/icons/facebook.png" alt="Facebook" />
          </a>
          <a href="https://instagram.com">
            <img src="/assets/icons/instagram.png" alt="Instagram" />
          </a>
          <a href="https://twitter.com">
            <img src="/assets/icons/twitter.png" alt="Twitter" />
          </a>
        </div>
      </div>
    </footer>
  );
}
