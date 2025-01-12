import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tag } from '../../uxcomic-types'

interface TagState {
  list: Tag[]
  selected?: Tag
  filtered: Tag[]
}

const initialState: TagState = {
  list: [],
  filtered: [],
}

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.list = action.payload
    },
    setSelectedTag: (state, action: PayloadAction<Tag | undefined>) => {
      state.selected = action.payload
    },
    selectTagsByCategory: (state, action: PayloadAction<string>) => {
      state.filtered = state.list.filter(
        (tag) => tag.categoryId === action.payload
      )
    },
  },
})

export const { setTags, setSelectedTag, selectTagsByCategory } =
  tagSlice.actions

export default tagSlice.reducer
