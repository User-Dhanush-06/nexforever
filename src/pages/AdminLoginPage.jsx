import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, ShieldAlert, Loader2, Sparkles } from 'lucide-react';
import { adminLogin } from '../services/apiClient';

export default function AdminLoginPage({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your studio admin email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const admin = await adminLogin({ email: email.trim(), password });
      if (onLoginSuccess) {
        onLoginSuccess(admin);
      }
    } catch (err) {
      setError(err?.message || 'Invalid credentials or session expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-shell">
      <div className="ambient-sides" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-overlay" aria-hidden="true" />

      <div className="admin-auth-card">
        <div className="admin-auth-card__header">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('/');
            }}
            className="admin-auth-back"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to Studio</span>
          </a>

          <div className="admin-auth-badge">
            <Sparkles size={12} aria-hidden="true" />
            <span>NexForever Platform</span>
          </div>

          <h1 className="admin-auth-title">Studio Admin</h1>
          <p className="admin-auth-sub">
            Sign in with your configured studio credentials to manage inquiries, projects and studio settings.
          </p>
        </div>

        {error && (
          <div className="admin-alert admin-alert--error" role="alert">
            <ShieldAlert size={16} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-auth-form" noValidate>
          <div className="admin-form-group">
            <label htmlFor="admin-email" className="admin-form-label">
              Admin Email
            </label>
            <div className="admin-input-wrap">
              <Mail size={16} className="admin-input-icon" aria-hidden="true" />
              <input
                id="admin-email"
                type="email"
                className="admin-input"
                placeholder="admin@nexforever.studio"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-pass" className="admin-form-label">
              Password
            </label>
            <div className="admin-input-wrap">
              <Lock size={16} className="admin-input-icon" aria-hidden="true" />
              <input
                id="admin-pass"
                type="password"
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn--primary admin-btn--full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="admin-spin" aria-hidden="true" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Studio CMS</span>
            )}
          </button>
        </form>

        <div className="admin-auth-card__footer">
          <p>Protected by Spring Security session authentication &amp; CSRF validation.</p>
        </div>
      </div>
    </div>
  );
}

