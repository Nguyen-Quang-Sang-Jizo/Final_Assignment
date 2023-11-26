import { PokemonHome } from '../../interface/interface';
import { Grid } from '@mui/material';
import React, { useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { useSelector, useDispatch } from 'react-redux';
import { deleteFavorite, updateFavorite, PokemonSliceState } from '../../../redux/Slice/pokemonSlice';

const MyPokemonList: React.FC = () => {
  const favoritePokemon = useSelector((state: { favorite: PokemonSliceState }) => state.favorite.value);
  const dispatch = useDispatch();
  console.log(favoritePokemon)

  const id = useMemo(() => favoritePokemon.map((pokemon: PokemonHome) => pokemon.id), [favoritePokemon]);

  const handleConfirmFavorite = (pokemon: PokemonHome) => {
    if (favoritePokemon.some((favPokemon: any) => favPokemon.id === pokemon.id)) {
      dispatch(deleteFavorite(pokemon.id));
      toast.success('Delete success!');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = favoritePokemon.findIndex((pokemon: any) => pokemon.id === active.id);
      const newIndex = favoritePokemon.findIndex((pokemon: any) => pokemon.id === over.id);
      const newFavoritePokemon = arrayMove(favoritePokemon, oldIndex, newIndex);
      dispatch(updateFavorite(newFavoritePokemon));
    }
  };

  return (
    <div style={{ padding: '80px 28px' }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          <SortableContext items={id}>
            {favoritePokemon.map((pokemon: any) => (
              <SortableItem
                key={pokemon.id}
                favoritePokemon={pokemon}
                handleConfirmFavorite={handleConfirmFavorite}
              />
            ))}
          </SortableContext>
        </Grid>
      </DndContext>
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default MyPokemonList;
