import { configureStore } from '@reduxjs/toolkit'
import favoriteCounter from './Slice/pokemonSlice'

export default configureStore({
    reducer: {
        favorite: favoriteCounter
    }
})