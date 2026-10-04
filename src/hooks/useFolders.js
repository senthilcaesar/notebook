import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "./useLocalStorageState.js";

export function useFolders(userId, cards = []) {
  const storageKey = `nb_folders_${userId || "guest"}`;
  const [storedFolders, setStoredFolders] = useLocalStorageState(storageKey, [
    "notes",
  ]);

  // Collect all unique folder names from both stored custom folders and existing cards
  const folders = useMemo(() => {
    const set = new Set();
    // Add stored folders first
    (storedFolders || []).forEach((f) => {
      const trimmed = (f || "").trim();
      if (trimmed) set.add(trimmed);
    });
    // Add any folder names from cards
    cards.forEach((c) => {
      const trimmed = (c.folder || "").trim();
      if (trimmed) set.add(trimmed);
    });

    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
  }, [cards, storedFolders]);

  const folderCounts = useMemo(() => {
    const counts = new Map();
    folders.forEach((f) => counts.set(f, 0));
    cards.forEach((c) => {
      const folderName = (c.folder || "").trim();
      if (folderName && counts.has(folderName)) {
        counts.set(folderName, counts.get(folderName) + 1);
      }
    });
    return counts;
  }, [cards, folders]);

  const folderList = useMemo(() => {
    return folders.map((name) => ({
      name,
      count: folderCounts.get(name) || 0,
    }));
  }, [folders, folderCounts]);

  const unfiledCount = useMemo(() => {
    return cards.filter((c) => !(c.folder || "").trim()).length;
  }, [cards]);

  const allCount = cards.length;

  const createFolder = useCallback(
    (name) => {
      const trimmed = (name || "").trim();
      if (!trimmed) {
        throw new Error("Folder name cannot be empty.");
      }
      if (trimmed.toLowerCase() === "all" || trimmed.toLowerCase() === "unfiled") {
        throw new Error(`"${trimmed}" is a reserved folder name.`);
      }

      const existing = folders.find(
        (f) => f.toLowerCase() === trimmed.toLowerCase(),
      );
      if (existing) {
        return existing;
      }

      setStoredFolders((current) => [...(current || []), trimmed]);
      return trimmed;
    },
    [folders, setStoredFolders],
  );

  const renameFolder = useCallback(
    async (oldName, newName, patchCard) => {
      const trimmedOld = (oldName || "").trim();
      const trimmedNew = (newName || "").trim();

      if (!trimmedNew) {
        throw new Error("Folder name cannot be empty.");
      }
      if (
        trimmedNew.toLowerCase() === "all" ||
        trimmedNew.toLowerCase() === "unfiled"
      ) {
        throw new Error(`"${trimmedNew}" is a reserved folder name.`);
      }
      if (trimmedOld.toLowerCase() === trimmedNew.toLowerCase()) {
        return trimmedNew;
      }

      const duplicate = folders.some(
        (f) =>
          f.toLowerCase() === trimmedNew.toLowerCase() &&
          f.toLowerCase() !== trimmedOld.toLowerCase(),
      );
      if (duplicate) {
        throw new Error(`Folder "${trimmedNew}" already exists.`);
      }

      // Update stored list
      setStoredFolders((current) => {
        const next = (current || []).map((f) =>
          f.trim().toLowerCase() === trimmedOld.toLowerCase() ? trimmedNew : f,
        );
        if (!next.some((f) => f.toLowerCase() === trimmedNew.toLowerCase())) {
          next.push(trimmedNew);
        }
        return next;
      });

      // Update any cards in this folder
      if (patchCard) {
        const affectedCards = cards.filter(
          (c) => (c.folder || "").trim().toLowerCase() === trimmedOld.toLowerCase(),
        );
        for (const card of affectedCards) {
          await patchCard(card.id, { folder: trimmedNew });
        }
      }

      return trimmedNew;
    },
    [cards, folders, setStoredFolders],
  );

  const deleteFolder = useCallback(
    async (folderName, patchCard) => {
      const trimmed = (folderName || "").trim();

      // Remove from stored folders
      setStoredFolders((current) =>
        (current || []).filter(
          (f) => f.trim().toLowerCase() !== trimmed.toLowerCase(),
        ),
      );

      // Move cards inside this folder to unfiled
      if (patchCard) {
        const affectedCards = cards.filter(
          (c) => (c.folder || "").trim().toLowerCase() === trimmed.toLowerCase(),
        );
        for (const card of affectedCards) {
          await patchCard(card.id, { folder: "" });
        }
      }
    },
    [cards, setStoredFolders],
  );

  return {
    folders,
    folderList,
    unfiledCount,
    allCount,
    createFolder,
    renameFolder,
    deleteFolder,
  };
}
