// Cache utility functions for managing session storage and memory cache

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private memoryCache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_EXPIRY = 30 * 60 * 1000; // 30 minutes

  // Set item in both memory cache and session storage
  set<T>(key: string, data: T, expiry?: number): void {
    const expiryTime = expiry || this.DEFAULT_EXPIRY;
    const timestamp = Date.now();
    
    const cacheItem: CacheItem<T> = {
      data,
      timestamp,
      expiry: timestamp + expiryTime
    };

    // Store in memory cache
    this.memoryCache.set(key, cacheItem);

    // Store in session storage
    try {
      sessionStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Failed to store in session storage:', error);
    }
  }

  // Get item from cache (memory first, then session storage)
  get<T>(key: string): T | null {
    // Try memory cache first
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && Date.now() < memoryItem.expiry) {
      return memoryItem.data;
    }

    // Try session storage
    try {
      const sessionItem = sessionStorage.getItem(key);
      if (sessionItem) {
        const parsedItem: CacheItem<T> = JSON.parse(sessionItem);
        if (Date.now() < parsedItem.expiry) {
          // Restore to memory cache
          this.memoryCache.set(key, parsedItem);
          return parsedItem.data;
        } else {
          // Remove expired item
          sessionStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve from session storage:', error);
    }

    return null;
  }

  // Remove item from both caches
  remove(key: string): void {
    this.memoryCache.delete(key);
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from session storage:', error);
    }
  }

  // Clear all cached data
  clear(): void {
    this.memoryCache.clear();
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear session storage:', error);
    }
  }

  // Get cache statistics
  getStats(): { memorySize: number; sessionSize: number } {
    return {
      memorySize: this.memoryCache.size,
      sessionSize: sessionStorage.length
    };
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    
    // Clean memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (now >= item.expiry) {
        this.memoryCache.delete(key);
      }
    }

    // Clean session storage
    try {
      const keys = Object.keys(sessionStorage);
      for (const key of keys) {
        const item = sessionStorage.getItem(key);
        if (item) {
          try {
            const parsedItem: CacheItem<any> = JSON.parse(item);
            if (now >= parsedItem.expiry) {
              sessionStorage.removeItem(key);
            }
          } catch {
            // Remove invalid items
            sessionStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup session storage:', error);
    }
  }
}

// Create a singleton instance
export const cacheManager = new CacheManager();

// Convenience functions
export const setCache = <T>(key: string, data: T, expiry?: number): void => {
  cacheManager.set(key, data, expiry);
};

export const getCache = <T>(key: string): T | null => {
  return cacheManager.get<T>(key);
};

export const removeCache = (key: string): void => {
  cacheManager.remove(key);
};

export const clearCache = (): void => {
  cacheManager.clear();
};

// User-specific cache functions
export const setUserCache = <T>(key: string, data: T, expiry?: number): void => {
  const userKey = `user_${key}`;
  cacheManager.set(userKey, data, expiry);
};

export const getUserCache = <T>(key: string): T | null => {
  const userKey = `user_${key}`;
  return cacheManager.get<T>(userKey);
};

export const removeUserCache = (key: string): void => {
  const userKey = `user_${key}`;
  cacheManager.remove(userKey);
};

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    cacheManager.cleanup();
  });
}

// Periodic cleanup (every 5 minutes)
setInterval(() => {
  cacheManager.cleanup();
}, 5 * 60 * 1000);
