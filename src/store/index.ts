import { configureStore } from "@reduxjs/toolkit";

type AppMetaState = {
  initialized: boolean;
};

const initialAppMetaState: AppMetaState = {
  initialized: true,
};

function appMetaReducer(state = initialAppMetaState) {
  return state;
}

export const store = configureStore({
  reducer: {
    appMeta: appMetaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
