import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const toggle = () => setOpen(v => !v);
  const close = () => setOpen(false);

  // Close on escape, outside click, and when resizing above mobile
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onClick = (e) => {
      if (!open) return;
      const el = menuRef.current;
      const toggleEl = toggleRef.current;
      if (el && el.contains(e.target)) return;
      if (toggleEl && toggleEl.contains(e.target)) return;
      close();
    };
    const onResize = () => { if (window.innerWidth > 640) close(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <header className="navbar">
      <div className="container wide navbar-inner">
        <div className="brand">
          <img src={logo} alt="CodeStash" className="brand-logo" />
          <Link to="/" aria-label="CodeStash home" onClick={close}><span>CodeStash</span></Link>
        </div>
        <button
          ref={toggleRef}
          className="btn ghost nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={(e) => { e.stopPropagation(); toggle(); }}
        >
          {/* simple hamburger icon */}
          <span className="hamburger" aria-hidden="true"></span>
        </button>
        {open && <button className="nav-backdrop" aria-hidden="true" tabIndex={-1} onClick={close} />}
        <nav id="site-menu" ref={menuRef} className={`nav-actions ${open ? 'open' : ''}`}>
          <Link to="/" onClick={close} className={`btn ghost${location.pathname === '/' ? ' active' : ''}`}>Home</Link>
          {token && <Link to="/snippets/new" onClick={close} className="btn">New Snippet</Link>}
          {token ? (
            <>
              <Link to="/profile" onClick={close} className="btn ghost" title="Profile">
                {user?.username ? `@${user.username}` : 'Profile'}
              </Link>
              <button className="btn ghost" onClick={() => { logout(); close(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={close} className="btn primary">Sign in</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
