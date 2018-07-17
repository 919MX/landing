class ShimStorage {
  constructor() {
    this._data = {}
  }

  length() {
    return Object.keys(this._data).length
  }

  key(index) {
    return Object.keys(this._data).sort()[index]
  }

  getItem(key) {
    return this._data[key]
  }

  setItem(key, value) {
    this._data[key] = value
  }

  removeItem(key) {
    delete this._data[key]
  }

  clear() {
    this._data = {}
  }
}

function hasStorage(storage) {
  const testKey = '__testLocalStorageExists'
  try {
    const oldVal = storage.getItem(testKey)
    storage.setItem(testKey, testKey)
    if (oldVal === null || typeof oldVal === 'undefined') {
      storage.removeItem(testKey)
    } else {
      storage.setItem(testKey, oldVal)
    }

    return true
  } catch (e) {
    return false
  }
}

export const localStorage = hasStorage(window.localStorage) ? window.localStorage : new ShimStorage()

export const sessionStorage = hasStorage(window.sessionStorage) ? window.sessionStorage : new ShimStorage()
