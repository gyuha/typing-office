// Everything is kept in this browser only (no server).
const get = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
};
const set = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
};

export const getName = () => get('to.name', '');
export const setName = (n) => set('to.name', n);
export const getPack = () => get('to.pack', 'daily');
export const setPack = (p) => set('to.pack', p);
export const getRecords = () => get('to.records', []);
export function saveRecord(r) {
  const list = [...getRecords(), r].sort((a, b) => b.cleared - a.cleared || b.max - a.max).slice(0, 10);
  set('to.records', list);
}
