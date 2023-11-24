import { PokemonHome } from "../../interface/interface";
import {
  Grid,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
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
import { SortableItem } from "./SortableItem"

type IProps = {
  setFavoritePokemon: React.Dispatch<React.SetStateAction<PokemonHome[]>>;
  favoritePokemon: PokemonHome[];
};

const MyPokemonList: React.FC<IProps> = (props) => {
  const { favoritePokemon, setFavoritePokemon } = props;

  const id = useMemo(() => favoritePokemon.map((id: PokemonHome) => id.id), [favoritePokemon]);

  console.log(id);

  const handleConfirmFavorite = (pokemon: PokemonHome) => {
    if (favoritePokemon.some((favPokemon) => favPokemon.id === pokemon.id)) {
      setFavoritePokemon((prevFavorites) => prevFavorites.filter((favPokemon) => favPokemon.id !== pokemon.id));
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
      const oldIndex = favoritePokemon.findIndex((pokemon) => pokemon.id === active.id);
      const newIndex = favoritePokemon.findIndex((pokemon) => pokemon.id === over.id);
      const newFavoritePokemon = arrayMove(favoritePokemon, oldIndex, newIndex);
      setFavoritePokemon(newFavoritePokemon);
    }
  };

  return (
    <div style={{ padding: '80px 28px' }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          <SortableContext
            items={id}
          >
            {favoritePokemon.map((pokemon, index) => (
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