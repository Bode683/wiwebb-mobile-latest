import { createMMKV } from 'react-native-mmkv';

export const mmkvStorage = createMMKV({
  id: 'user-starter-storage',
  //   path: `${USER_DIRECTORY}/storage`,
  //   encryptionKey: 'encryption_key',
});
