import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PokemonHome } from '../../interface/interface';

export interface PokemonSliceState {
  value: PokemonHome[];
}

const initialState: PokemonSliceState = {
  value: [],
};

export const pokemonSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<PokemonHome>) => {
      state.value.push(action.payload);
    },
    deleteFavorite: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((pokemon) => pokemon.id !== action.payload);
    },
    updateFavorite: (state, action: PayloadAction<PokemonHome[]>) => {
      state.value = action.payload;
    },
    updateNameFavorite: (state, action: PayloadAction<{ id: number; newName: string }>) => {
      const { id, newName } = action.payload;
      const index = state.value.findIndex(pokemon => pokemon.id === id);
      if (index !== -1) {
        const updatedPokemon = { ...state.value[index] };
        updatedPokemon.species.name = newName;
        state.value[index] = updatedPokemon;
      }
    },
  },
});

export const { addFavorite, deleteFavorite, updateFavorite, updateNameFavorite } = pokemonSlice.actions;

export default pokemonSlice.reducer;
