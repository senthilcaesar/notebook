import { Hash, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function Sidebar({ tags, activeTag, onSelect, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <button type="button" className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="sidebar-panel"
          >
            <div className="sidebar-header">
              <p className="eyebrow">Filter</p>
              <h2>Tags</h2>
            </div>

            <ul className="sidebar-list">
              {tags.map((tag) => (
                <li key={tag.name}>
                  <button
                    type="button"
                    className={`sidebar-item ${activeTag === tag.name ? 'is-active' : ''}`}
                    onClick={() => onSelect(tag.name)}
                  >
                    <span className="sidebar-item-name">
                      <Hash size={14} />
                      {tag.name}
                    </span>
                    <span className="sidebar-item-count">{tag.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </aside>
  );
}
