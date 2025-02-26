// components/Navigation.js

import React from 'react';
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="navigation">
      <Link href="/" legacyBehavior>
        <a>Home</a>
      </Link>
      <Link href="/about" legacyBehavior>
        <a>About</a>
      </Link>
      <Link href="/features" legacyBehavior>
        <a>Features</a>
      </Link>
      <Link href="/contact" legacyBehavior>
        <a>Contact</a>
      </Link>

      <style jsx>{`
        .navigation {
          display: flex;
          justify-content: space-around;
          background: #333;
          padding: 10px;
        }
        .navigation a {
          color: #fff;
          text-decoration: none;
          padding: 10px 20px;
        }
        .navigation a:hover {
          background: #555;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
