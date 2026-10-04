import { FolderPlus, Pencil, Plus, Trash2 } from "lucide-react";
import { FolderGraphic } from "./FolderGraphic.jsx";

const KNOWN_EMOJIS = {
  ai: "🤖",
  notes: "📝",
  blogs: "✍️",
  "course work": "🎓",
  github: "💻",
  paper: "📄",
  tools: "🛠️",
  tour: "🧭",
};

function getFolderBadge(folderName) {
  const key = (folderName || "").trim().toLowerCase();
  return KNOWN_EMOJIS[key] || null;
}

export function FolderGrid({
  folders = [],
  unfiledCount = 0,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}) {
  return (
    <div className="folder-grid-section">
      <div className="folder-grid-header">
        <div>
          <p className="eyebrow">Organize</p>
          <h2 className="folder-grid-title">Folders</h2>
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={onCreateFolder}
        >
          <Plus size={16} />
          <span>New Folder</span>
        </button>
      </div>

      <div className="folder-grid-cards">
        {folders.map((folder) => {
          const badge = getFolderBadge(folder.name);
          return (
            <div
              key={folder.name}
              className="folder-card-tile"
              onClick={() => onSelectFolder(folder.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectFolder(folder.name);
                }
              }}
            >
              <div className="folder-card-tile-actions">
                <button
                  type="button"
                  className="folder-tile-action-btn"
                  title={`Rename "${folder.name}"`}
                  aria-label={`Rename "${folder.name}"`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRenameFolder?.(folder.name);
                  }}
                >
                  <Pencil size={12} />
                </button>
                <button
                  type="button"
                  className="folder-tile-action-btn is-danger"
                  title={`Delete "${folder.name}"`}
                  aria-label={`Delete "${folder.name}"`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder?.(folder.name);
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="folder-card-tile-icon-wrap">
                <FolderGraphic emoji={badge} size={72} />
              </div>

              <h3 className="folder-card-tile-title">{folder.name}</h3>

              <span className="folder-card-tile-count">
                {folder.count} {folder.count === 1 ? "note" : "notes"}
              </span>
            </div>
          );
        })}

        {/* Unfiled Folder Tile matching the screenshot */}
        <div
          className="folder-card-tile folder-card-tile-unfiled"
          onClick={() => onSelectFolder("__unfiled__")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectFolder("__unfiled__");
            }
          }}
        >
          <div className="folder-card-tile-icon-wrap">
            <FolderGraphic size={72} />
          </div>

          <h3 className="folder-card-tile-title is-italic">Unfiled</h3>

          <span className="folder-card-tile-count">
            {unfiledCount} {unfiledCount === 1 ? "note" : "notes"}
          </span>
        </div>

        {/* Create New Folder Tile */}
        <div
          className="folder-card-tile folder-card-tile-create"
          onClick={onCreateFolder}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onCreateFolder();
            }
          }}
        >
          <div className="folder-create-icon-circle">
            <FolderPlus size={26} />
          </div>
          <h3 className="folder-card-tile-title">New Folder</h3>
          <span className="folder-card-tile-count">Create folder</span>
        </div>
      </div>
    </div>
  );
}
