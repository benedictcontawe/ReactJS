import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
}

interface BlogState {
  posts: BlogPost[];
}

const initialState: BlogState = {
  posts: [],
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<BlogPost[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<BlogPost>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<BlogPost>) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.posts[index] = action.payload;
    },
    deletePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
  },
});

export const { setPosts, addPost, updatePost, deletePost } = blogSlice.actions;
export default blogSlice.reducer;