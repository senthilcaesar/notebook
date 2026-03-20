import { motion } from 'framer-motion';
import { BookOpenText, Cloud, LockKeyhole } from 'lucide-react';

export function LoginScreen({ onLogin, errorMessage }) {
  return (
    <main className="login-shell">
      <motion.section
        className="login-card"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="login-brand">
          <div className="brand-mark">
            <BookOpenText size={30} />
          </div>
          <div>
            <p className="eyebrow">Notebook Cloud</p>
            <h1>My Notebook</h1>
            <p className="lede">Ruled flashcards, private sync, and a desk-like workspace built for quick recall.</p>
          </div>
        </div>

        <div className="login-points">
          <div className="login-point">
            <Cloud size={18} />
            <span>Real-time sync across tabs and devices</span>
          </div>
          <div className="login-point">
            <LockKeyhole size={18} />
            <span>Cards stay scoped to your own Google account</span>
          </div>
        </div>

        <button type="button" className="button button-primary google-button" onClick={onLogin}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width="18"
            height="18"
          />
          Continue with Google
        </button>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
      </motion.section>
    </main>
  );
}
