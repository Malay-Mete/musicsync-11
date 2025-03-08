
/**
 * Get data from localStorage
 * @param key The localStorage key
 * @param defaultValue Default value if key doesn't exist
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 * @param key The localStorage key
 * @param value The value to save
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
  }
}

/**
 * Remove data from localStorage
 * @param key The localStorage key to remove
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
}

// Constants for localStorage keys
export const STORAGE_KEYS = {
  FAVORITES: 'music-favorites',
  RECENTLY_PLAYED: 'music-recently-played',
  SEARCH_HISTORY: 'music-search-history',
  VOLUME: 'music-volume'
};
