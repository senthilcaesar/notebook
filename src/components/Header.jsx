import {
  BookOpenText,
  Code2,
  LogOut,
  Moon,
  Plus,
  Search,
  SunMedium,
} from 'lucide-react';

function SyncIndicator({ state }) {
  const label = state === 'ok' ? 'Synced' : state === 'error' ? 'Offline' : 'Syncing';
  return (
    <div className="sync-indicator">
      <span className={`sync-dot ${state === 'ok' ? 'is-ok' : state === 'error' ? 'is-error' : 'is-syncing'}`} />
      <span>{label}</span>
    </div>
  );
}

export function Header({
  user,
  searchQuery,
  onSearchChange,
  onCreate,
  onOpenTechStack,
  syncState,
  theme,
  onToggleTheme,
  onLogout,
  greeting,
}) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-mark">
          <BookOpenText size={22} />
        </div>
        <div>
          <h1>My Notebook</h1>
          <p className="brand-subtitle">{greeting}</p>
        </div>
      </div>

      <div className="header-search">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search cards, notes, or tags"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search cards"
        />
      </div>

      <div className="header-actions">
        <SyncIndicator state={syncState} />

        <button type="button" className="button button-primary" onClick={onCreate}>
          <Plus size={18} />
          New Card
        </button>

        <button type="button" className="button button-secondary header-tech-button" onClick={onOpenTechStack}>
          <Code2 size={16} />
          Tech Stack
        </button>

        <button type="button" className="icon-button" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
        </button>

        <div className="user-chip">
          {user.photoURL ? (
            <img className="user-avatar" src={user.photoURL} alt={user.displayName || user.email || 'User'} />
          ) : (
            <div className="user-avatar user-avatar-fallback">{(user.displayName || 'U').slice(0, 1)}</div>
          )}
          <span>{user.displayName || user.email || 'User'}</span>
        </div>

        <button type="button" className="icon-button" onClick={onLogout} aria-label="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
