import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PokemonHome } from '../../interface/interface';
import {
  Typography,
  Grid,
  Paper,
  IconButton,
  CardMedia
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Props {
  favoritePokemon: PokemonHome
  handleConfirmFavorite: (pokemon: PokemonHome) => void;
}

export const SortableItem = ({ favoritePokemon, handleConfirmFavorite }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: favoritePokemon.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Grid
        item
        key={favoritePokemon.id}
        xs={5}
        sm={3}
        md={2.4}
        lg={1.5}
        sx={{
          padding: '10px',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgb(250, 230, 230)',
            borderRadius: '25%',
            width: '172px',
            height: '172px'
          }}
        >
          <Link to={`/pokemon/${favoritePokemon.id}`} style={{ textDecoration: 'none' }}>
            <CardMedia
              component="img"
              height="100px"
              width="100px"
              image={favoritePokemon?.sprites.other.home.front_default}
              alt={favoritePokemon.species.name}
              sx={{
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
            />
          </Link>
          <Typography variant="h6" component="h6" sx={{ mt: 1, fontFamily: 'Monaco', fontSize: '15px' }}>
            {favoritePokemon.species.name}
          </Typography>
          <IconButton
            sx={{ color: 'red' }}
            onClick={() => handleConfirmFavorite(favoritePokemon)}
            title="Double tap to delete"
          >
            <FavoriteIcon />
          </IconButton>
        </Paper>
      </Grid>
    </div>
  );
}