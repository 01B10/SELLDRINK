import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { productReducer } from './slices/product.slice';
import { Auth } from '../api/Auth';
import AuthReducer from './slices/Auth.slice';
import { ApiUser } from '../api/User';
import { sizeReducer } from './slices/size.slice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['size'],
};
const rootReducer = combineReducers({
  products: productReducer,
  auth: AuthReducer,
  size: sizeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    persistedReducer,
    [Auth.reducerPath]: Auth.reducer,
    [ApiUser.reducerPath]: ApiUser.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(Auth.middleware)
      .concat(ApiUser.middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
