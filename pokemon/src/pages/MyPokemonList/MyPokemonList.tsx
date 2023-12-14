import { PokemonHome } from '../../interface/interface';
import { Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
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

interface Props {
  refresh: boolean;
}

const MyPokemonList = ({ refresh }: Props) => {
  const isLogin = localStorage.getItem('isLogin') || '';
  const list = localStorage.getItem(isLogin) || '';
  let fav: { data: PokemonHome[] } = { data: [] };

  if (list) {
    try {
      fav = JSON.parse(list);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      fav = { data: [] };
    }
  } else {
    fav = { data: [] };
  }

  const [favoritePokemon, setFavoritePokemon] = useState<PokemonHome[]>(fav.data);

  useEffect(() => {
    setFavoritePokemon(fav.data)
  }, [refresh])

  const id = useMemo(() => favoritePokemon.map((pokemon: any) => pokemon.id), [favoritePokemon]);

  const handleConfirmFavorite = (pokemon: PokemonHome) => {
    if (favoritePokemon.some((favPokemon: any) => favPokemon.id === pokemon.id)) {
      const index = fav.data.findIndex((favPokemon: any) => favPokemon.id === pokemon.id);
      fav.data.splice(index, 1);
      const updatedData = [...fav.data];
      setFavoritePokemon(updatedData);
      const newData = JSON.stringify({ username: isLogin, data: updatedData })
      localStorage.setItem(isLogin, newData);
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
      setFavoritePokemon(newFavoritePokemon);
      const newData = JSON.stringify({ username: isLogin, data: newFavoritePokemon })
      localStorage.setItem(isLogin, newData);
    }
  };

  return (
    <div style={{ padding: '75px 20px' }}>
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
