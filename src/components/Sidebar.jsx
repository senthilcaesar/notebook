import {
  Folder,
  FolderKanban,
  FolderOpen,
  FolderPlus,
  Hash,
  Inbox,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Sidebar({
  folders = [],
  activeFolder = "All",
  onSelectFolder,
  onOpenCreateFolder,
  onOpenRenameFolder,
  onOpenDeleteFolder,
  unfiledCount = 0,
  allCount = 0,
  tags = [],
  activeTag = "All",
  onSelectTag,
  collapsed,
  onToggle,
}) {
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="sidebar-panel"
          >
            {/* ----------------- Folders Section ----------------- */}
            <div className="sidebar-section">
              <div className="sidebar-header sidebar-header-actionable">
                <div>
                  <p className="eyebrow">Organize</p>
                  <h2>Folders</h2>
                </div>
                <button
                  type="button"
                  className="sidebar-action-btn"
                  onClick={onOpenCreateFolder}
                  title="Create new folder"
                  aria-label="Create new folder"
                >
                  <FolderPlus size={16} />
                </button>
              </div>

              <ul className="sidebar-list">
                <li>
                  <button
                    type="button"
                    className={`sidebar-item ${activeFolder === "__folders_overview__" ? "is-active" : ""}`}
                    onClick={() => onSelectFolder("__folders_overview__")}
                  >
                    <span className="sidebar-item-name">
                      <FolderKanban size={14} />
                      Browse Folders
                    </span>
                    <span className="sidebar-item-count">{folders.length}</span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className={`sidebar-item ${activeFolder === "All" ? "is-active" : ""}`}
                    onClick={() => onSelectFolder("All")}
                  >
                    <span className="sidebar-item-name">
                      <Layers size={14} />
                      All Notes
                    </span>
                    <span className="sidebar-item-count">{allCount}</span>
                  </button>
                </li>

                {unfiledCount > 0 ? (
                  <li>
                    <button
                      type="button"
                      className={`sidebar-item ${activeFolder === "__unfiled__" ? "is-active" : ""}`}
                      onClick={() => onSelectFolder("__unfiled__")}
                    >
                      <span className="sidebar-item-name">
                        <Inbox size={14} />
                        Unfiled
                      </span>
                      <span className="sidebar-item-count">{unfiledCount}</span>
                    </button>
                  </li>
                ) : null}

                {folders.map((folder) => {
                  const isActive = activeFolder === folder.name;
                  return (
                    <li key={folder.name} className="sidebar-folder-row">
                      <button
                        type="button"
                        className={`sidebar-item sidebar-folder-item ${isActive ? "is-active" : ""}`}
                        onClick={() => onSelectFolder(folder.name)}
                      >
                        <span className="sidebar-item-name">
                          {isActive ? (
                            <FolderOpen size={14} />
                          ) : (
                            <Folder size={14} />
                          )}
                          <span className="sidebar-item-label">
                            {folder.name}
                          </span>
                        </span>
                        <span className="sidebar-item-count">
                          {folder.count}
                        </span>
                      </button>

                      <div className="sidebar-item-actions">
                        <button
                          type="button"
                          className="sidebar-inline-btn"
                          title={`Rename folder "${folder.name}"`}
                          aria-label={`Rename folder "${folder.name}"`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenRenameFolder?.(folder.name);
                          }}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          className="sidebar-inline-btn is-danger"
                          title={`Delete folder "${folder.name}"`}
                          aria-label={`Delete folder "${folder.name}"`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDeleteFolder?.(folder.name);
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ----------------- Tags Section ----------------- */}
            <div className="sidebar-section">
              <div className="sidebar-header">
                <p className="eyebrow">Filter</p>
                <h2>Tags</h2>
              </div>

              <ul className="sidebar-list">
                {tags.map((tag) => (
                  <li key={tag.name}>
                    <button
                      type="button"
                      className={`sidebar-item ${activeTag === tag.name ? "is-active" : ""}`}
                      onClick={() => onSelectTag(tag.name)}
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
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </aside>
  );
}
