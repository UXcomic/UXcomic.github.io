import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category } from '../../uxcomic-types'

interface CategoryState {
  list: Category[]
  selected?: Category
}

const initialState: CategoryState = {
  list: [],
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.list = action.payload
    },
    setSelectedCategory: (
      state,
      action: PayloadAction<Category | undefined>
    ) => {
      state.selected = action.payload
    },
  },
})

export const { setCategories, setSelectedCategory } = categorySlice.actions

export default categorySlice.reducer
