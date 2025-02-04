import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&#169; 2025 Photographer's App.</p>
        <div className="social-icons">
          <a href="https://facebook.com">
            <FaFacebook color="white" />
          </a>
          <a href="https://instagram.com">
            <FaInstagram color="white" />
          </a>
          <a href="https://twitter.com">
            <FaTwitter color="white" />
          </a>
        </div>
      </div>
    </footer>
  );
}
