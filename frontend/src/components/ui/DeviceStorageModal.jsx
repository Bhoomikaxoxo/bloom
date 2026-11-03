import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSlateStore from '../../store/useSlateStore';
import {
  ShieldCheck, HardDrive, Download, Upload, Trash2, Clock,
  X, Check, AlertTriangle, Sparkles, RefreshCw
} from 'lucide-react';

const DeviceStorageModal = ({ isOpen, onClose }) => {
  const {
    notes = [],
    folders = [],
    tags = [],
    journals = {},
    calendarEvents = [],
    activeAestheticTheme,
    folderThemes = {},
    retentionSettings = {},
    updateRetentionSettings,
    importWorkspace,
    resetWorkspace,
  } = useSlateStore();

  const fileInputRef = useRef(null);
  const [storageSizeStr, setStorageSizeStr] = useState('Calculating…');
  const [isPersistent, setIsPersistent] = useState(true);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Calculate local storage size
  useEffect(() => {
    if (!isOpen) return;

    try {
      const dataStr = localStorage.getItem('bloom-workspace-storage') || '';
      const bytes = new Blob([dataStr]).size;
      if (bytes < 1024) {
        setStorageSizeStr(`${bytes} Bytes`);
      } else if (bytes < 1024 * 1024) {
        setStorageSizeStr(`${(bytes / 1024).toFixed(1)} KB`);
      } else {
        setStorageSizeStr(`${(bytes / (1024 * 1024)).toFixed(2)} MB`);
      }
    } catch (e) {
      setStorageSizeStr('~150 KB');
    }

    if (navigator.storage && navigator.storage.persisted) {
      navigator.storage.persisted().then((persisted) => {
        setIsPersistent(persisted);
      }).catch(() => setIsPersistent(true));
    }
  }, [isOpen]);

  const activeNotesCount = notes.filter((n) => n.deletedAt === null).length;
  const memoryBoxCount = notes.filter((n) => n.deletedAt !== null).length;

  const handleExport = () => {
    try {
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        notes,
        folders,
        tags,
        journals,
        calendarEvents,
        activeAestheticTheme,
        folderThemes,
        retentionSettings,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `bloom-device-backup-${today}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        if (!json || typeof json !== 'object') {
          throw new Error('Invalid backup structure.');
        }

        importWorkspace(json);
        setImportSuccess(true);
        setImportError('');
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (err) {
        setImportError('Could not import file: Please choose a valid Bloom JSON backup.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-bg)] flex items-center justify-center text-[var(--color-accent)]">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Device Storage & Privacy
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Local-first data management for this device
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 select-text">
          {/* Privacy & Device Independence Banner */}
          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[var(--color-text)]">
                100% Private to This Device
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Bloom does not require accounts or cloud sync. All your notes, personal journal entries, and calendar plans are stored directly in this device's browser and will never be uploaded anywhere.
              </p>
            </div>
          </div>

          {/* Storage Health & Metrics */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Device Data Metrics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] text-center">
                <span className="text-lg font-bold text-[var(--color-accent)]">{activeNotesCount}</span>
                <p className="text-[11px] font-medium text-[var(--color-text-muted)] mt-0.5">Notes</p>
              </div>
              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] text-center">
                <span className="text-lg font-bold text-[var(--color-accent)]">{calendarEvents.length}</span>
                <p className="text-[11px] font-medium text-[var(--color-text-muted)] mt-0.5">Planner Items</p>
              </div>
              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] text-center">
                <span className="text-lg font-bold text-[var(--color-accent)]">{storageSizeStr}</span>
                <p className="text-[11px] font-medium text-[var(--color-text-muted)] mt-0.5">Local Footprint</p>
              </div>
              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] text-center">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {isPersistent ? 'Protected' : 'Standard'}
                </span>
                <p className="text-[11px] font-medium text-[var(--color-text-muted)] mt-0.5">Persistence</p>
              </div>
            </div>
          </div>

          {/* Smart Inactivity & Retention Settings */}
          <div className="space-y-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Smart Retention & Hygiene
            </h4>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] cursor-pointer hover:bg-black/[0.04] transition-colors">
              <input
                type="checkbox"
                checked={retentionSettings?.autoPurgeTrash30Days !== false}
                onChange={(e) => updateRetentionSettings({ autoPurgeTrash30Days: e.target.checked })}
                className="w-4 h-4 mt-0.5 accent-[var(--color-accent)] rounded cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[var(--color-text)]">
                  Auto-purge Memory Box notes after 30 days
                </span>
                <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                  Deleted notes remain safe in your Memory Box for 30 days so you can recover them anytime. Afterward, they are cleaned up automatically to preserve device storage.
                </p>
              </div>
            </label>
          </div>

          {/* Portable Backup (Export & Import) */}
          <div className="space-y-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Backup & Device Transfer
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Want to take your workspace to another laptop or browser, or keep a safe backup? You can export your full workspace with one click.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleExport}
                className="px-4 py-2 bg-[var(--color-accent)] text-white text-xs font-bold rounded-xl shadow-2xs hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                {exportSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{exportSuccess ? 'Downloaded!' : 'Export Backup (.json)'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-[var(--color-text)] text-xs font-bold rounded-xl border border-black/[0.06] dark:border-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Import Backup</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {importSuccess && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Workspace restored successfully!
              </p>
            )}

            {importError && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1 animate-fade-in">
                <AlertTriangle className="w-3.5 h-3.5" /> {importError}
              </p>
            )}
          </div>

          {/* Reset Workspace */}
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset device storage & start fresh…</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-2 animate-fade-in">
                <p className="text-xs font-bold text-red-700 dark:text-red-300">
                  Are you sure you want to reset all data on this device?
                </p>
                <p className="text-[11px] text-red-600 dark:text-red-400">
                  This will erase all notes, daily journals, and calendar items on this browser.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={resetWorkspace}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Yes, reset device data
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1 bg-black/[0.05] dark:bg-white/[0.1] text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeviceStorageModal;

