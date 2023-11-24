import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Typography, Grid, Paper, IconButton, CardMedia } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { PokemonHome, Results } from '../../interface/interface';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

type IProps = {
  setFavoritePokemon: React.Dispatch<React.SetStateAction<PokemonHome[]>>;
  favoritePokemon: PokemonHome[];
};

const PokemonList: React.FC<IProps> = (props) => {
  const { favoritePokemon, setFavoritePokemon } = props;
  const offset = 0;

  
  const { isLoading, isError, data: pokemonData = [], error } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://pokeapi.co/api/v2/pokemon?offset='+offset+ '&limit=40')
        .then((res) => res.json())
        .then((data) => {
          const results = data.results;
          const requests = results.map((result: Results) => axios.get(result.url));
          return Promise.all(requests).then((pokemonResponses) =>
            pokemonResponses.map((pokemonRes) => pokemonRes.data)
          );
        }),
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleFavoriteClick = async (pokemon: PokemonHome) => {
    if (favoritePokemon.some((favPokemon) => favPokemon.id === pokemon.id)) {
      setFavoritePokemon((prevFavorites) => prevFavorites.filter((favPokemon) => favPokemon.id !== pokemon.id));
      toast.success('Delete success!');
    } else {
      setFavoritePokemon((prevFavorites) => [...prevFavorites, pokemon]);
      toast.success('Add to success!');
    }
  };

  return (
    <div style={{ padding: '75px 20px' }}>
      <Grid container spacing={2}>
        {pokemonData && Object.values(pokemonData).map((pokemon: PokemonHome) => {
          const isFavorite = favoritePokemon.some((favPokemon) => favPokemon.id === pokemon.id);
          return (
            <Grid
              item
              key={pokemon?.id}
              xs={5}
              sm={3}
              md={2.4}
              lg={1.5}
            >
              <Paper
                elevation={7}
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
                className='paper'
              >
                <Link to={`/pokemon/${pokemon?.id}`} >
                  {pokemon.sprites && pokemon.sprites.other && (
                    <CardMedia
                      component="img"
                      height="100"
                      width="100"
                      image={pokemon?.sprites.other.home.front_default}
                      alt={pokemon?.species.name}
                      sx={{
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.3)',
                        },
                      }}
                    />
                  )}
                </Link>
                {pokemon.species && (
                  <Typography variant="h6" component="h6" sx={{ mt: 1, fontFamily: 'Monaco', fontSize: '15px' }}>
                    {pokemon.species.name}
                  </Typography>
                )}
                <IconButton
                  sx={{ color: isFavorite ? 'red' : 'grey' }}
                  aria-label="favorite"
                  onClick={() => handleFavoriteClick(pokemon)}
                  title={isFavorite ? 'Delete from My Pokemon List' : 'Add to My Pokemon List'}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                </IconButton>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default PokemonList;