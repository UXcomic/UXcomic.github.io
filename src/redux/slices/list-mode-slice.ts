import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ListModeState {
  isGrid: boolean
}

const initialState: ListModeState = {
  isGrid: true,
}

const listModeSlice = createSlice({
  name: 'listMode',
  initialState,
  reducers: {
    setIsGrid: (state, action: PayloadAction<boolean>) => {
      state.isGrid = action.payload
    },
  },
})

export const { setIsGrid } = listModeSlice.actions

export default listModeSlice.reducer
