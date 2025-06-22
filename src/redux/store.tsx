import { configureStore } from "@reduxjs/toolkit";
import blogReducer from './blogSlice';

const store = configureStore({
     reducer: {
        blog: blogReducer,
        //auth: authReducer,
     },
     //middleware: ,
      
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };