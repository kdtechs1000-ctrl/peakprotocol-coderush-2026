/**
 * services/indexedDbService.js
 * ============================
 * Manages local IndexedDB storage for offline PWA operations:
 * - Queues offline hazard reports
 * - Queues emergency SOS signals
 * - Caches red zones & survival guidelines for zero-connectivity situations
 */

const DB_NAME = 'NepalSafetyDB';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline_reports')) {
        db.createObjectStore('offline_reports', { keyPath: 'local_id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('offline_sos')) {
        db.createObjectStore('offline_sos', { keyPath: 'local_id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('cached_data')) {
        db.createObjectStore('cached_data', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Queue a hazard report locally when offline
 */
export async function queueOfflineReport(report) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('offline_reports', 'readwrite');
      const store = tx.objectStore('offline_reports');
      const item = { ...report, queued_at: new Date().toISOString() };
      const req = store.add(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('IndexedDB queueOfflineReport error:', err);
    // Fallback to localStorage
    const existing = JSON.parse(localStorage.getItem('offline_reports') || '[]');
    existing.push(report);
    localStorage.setItem('offline_reports', JSON.stringify(existing));
  }
}

/**
 * Queue SOS ping locally when offline
 */
export async function queueOfflineSos(sosData) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('offline_sos', 'readwrite');
      const store = tx.objectStore('offline_sos');
      const item = { ...sosData, queued_at: new Date().toISOString() };
      const req = store.add(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('IndexedDB queueOfflineSos error:', err);
  }
}

/**
 * Get all queued offline reports
 */
export async function getQueuedReports() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('offline_reports', 'readonly');
      const store = tx.objectStore('offline_reports');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return JSON.parse(localStorage.getItem('offline_reports') || '[]');
  }
}

/**
 * Clear queued reports after sync
 */
export async function clearQueuedReports() {
  try {
    const db = await openDB();
    const tx = db.transaction('offline_reports', 'readwrite');
    tx.objectStore('offline_reports').clear();
    localStorage.removeItem('offline_reports');
  } catch (err) {
    console.error('Failed to clear queued reports:', err);
  }
}
