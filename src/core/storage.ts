export class CoreStorage {
  private static cache = new Map<string, unknown>();
  private static storage = window.localStorage;

  public static get<T>(key: string, defaultValue: T): T {
    if (this.cache.has(key)) {
      return this.cache.get(key) as T;
    }

    let serializedValue: string | null = null;
    try {
      serializedValue = this.storage.getItem(key);
    } catch (error) {
      console.warn("Failed to load value from store", key, error);
    }

    if (serializedValue === null || serializedValue === "undefined") {
      return defaultValue;
    }

    try {
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.warn(
        "Failed to deserialize stored value.",
        { key, value: serializedValue },
        error
      );
      this.delete(key);
      return defaultValue;
    }
  }

  public static getOptional<T>(key: string): T | null {
    return this.get(key, null);
  }

  public static set(key: string, value: {}) {
    let serializedValue: string;

    try {
      serializedValue = JSON.stringify(value);
    } catch (error) {
      console.warn("Failed to serialize value to store", { key, value }, error);
      throw error;
    }

    this.cache.set(key, value);

    try {
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.warn(
        "Failed to save value to storage",
        { key, value, serializedValue },
        error
      );
    }
  }

  public static delete(key: string) {
    this.cache.delete(key);
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove ${key} from storage`, error);
    }
  }

  public static clear() {
    this.cache.clear();
    try {
      this.storage.clear();
    } catch (error) {
      console.warn("Failed to clear storage", error);
    }
  }
}
