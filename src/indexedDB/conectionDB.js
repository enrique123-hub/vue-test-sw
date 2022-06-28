import { openDb } from 'idb'

// eslint-disable-next-line no-unused-vars
const dbPromise = _ => {
  if (!('indexedDB' in window)) {
    throw new Error('Browser does not support IndexedDB')
  }

  return openDb('Vue-SW', 1, upgradeDb => {
    if (!upgradeDb.objectStoreNames.contains('users')) {
      upgradeDb.createObjectStore('users')
    }
  })
}

const checkStorage = async storeName => {
  try {
    const db = await dbPromise()
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)

    return store.get(storeName)
  } catch (error) {
    return error
  }
}

const saveToStorage = async (storeName, tasks) => {
  try {
    const db = await dbPromise()
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)

    store.put(tasks, storeName)

    return tx.complete
  } catch (error) {
    return error
  }
}

export default {
  checkStorage,
  saveToStorage
}
