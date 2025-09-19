import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

export default function Footer() {
  const { token } = useAuth();
  return (
    <footer className="site-footer">
      <div className="container wide footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="CodeStash" className="brand-logo" />
          <span>CodeStash</span>
        </div>
        <div className="footer-meta">
          <span>© 2025 CodeStash</span>
          <span>·</span>
          <Link to="/" aria-label="Home">Home</Link>
          {token && <>
            <span>·</span>
            <Link to="/snippets/new" aria-label="New Snippet">New Snippet</Link>
          </>}
          <span>·</span>
          {token ? (
            <Link to="/profile" aria-label="Profile">Profile</Link>
          ) : (
            <Link to="/auth" aria-label="Sign in">Sign in</Link>
          )}
        </div>
      </div>
    </footer>
  );
}
