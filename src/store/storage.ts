import { createMMKV } from 'react-native-mmkv';
import { Storage } from 'redux-persist';

// Dedicated MMKV instance for Redux persistence (separate from app storage
// in src/mmkv to avoid key collisions)
const reduxMmkv = createMMKV({ id: 'redux-persist-storage' });

const reduxStorage: Storage = {
  setItem: (key, value) => {
    reduxMmkv.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = reduxMmkv.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    reduxMmkv.delete(key);
    return Promise.resolve();
  },
};

export default reduxStorage;
