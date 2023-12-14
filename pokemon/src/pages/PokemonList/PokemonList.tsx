import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Typography, Grid, Paper, IconButton, CardMedia, CircularProgress, Box } from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PokemonHome, Results } from '../../interface/interface';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  refresh: boolean;
}

const PokemonList = ({ refresh }: Props) => {
  const isLogin = localStorage.getItem('isLogin') ?? '';
  const list = localStorage.getItem(isLogin) ?? '';
  let fav: { data: PokemonHome[] } = { data: [] };

  try {
    if (list) {
      fav = JSON.parse(list);
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
    fav = { data: [] };
  }

  const [favoritePokemon, setFavoritePokemon] = useState<PokemonHome[]>(fav.data);

  useEffect(() => {
    setFavoritePokemon(fav.data)
  }, [refresh])

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=30`);
    const results = response.data.results;
    const requests = results.map((result: Results) => axios.get(result.url));
    const pokemonResponses = await Promise.all(requests);
    const pokemonData = pokemonResponses.map((pokemonRes) => pokemonRes.data);
    return {
      data: pokemonData,
      offset: pageParam + 40,
      count: response.data.count
    };
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchData,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset;
      return nextOffset < lastPage.count ? nextOffset : undefined;
    },
    initialPageParam: 0
  });

  const handleFavoriteClick = async (pokemon: PokemonHome) => {
    if (isLogin == '') {
      toast.warning('Please log in');
      return;
    }
    if (favoritePokemon.some((favPokemon: any) => favPokemon.id === pokemon.id)) {
      const index = fav.data.findIndex((favPokemon: any) => favPokemon.id === pokemon.id);
      fav.data.splice(index, 1);
      const updatedData = [...fav.data]
      setFavoritePokemon(updatedData);
      const newData = JSON.stringify({ username: isLogin, data: updatedData })
      localStorage.setItem(isLogin, newData);
      toast.success('Delete success!');
    } else {
      fav.data.push(pokemon);
      const updatedData = [...fav.data]
      setFavoritePokemon(updatedData);
      const newData = JSON.stringify({ username: isLogin, data: updatedData })
      localStorage.setItem(isLogin, newData);
      toast.success('Add to success!');
    }
  };

  return (
    <>
      <div style={{ padding: '75px 20px' }}>
        {status === 'pending' ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : status === 'error' ? (
          <p>Error: {error.message}</p>
        ) : (
          <InfiniteScroll
            dataLength={data?.pages.length || 0}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<CircularProgress style={{ display: 'block', margin: '20px auto' }} />}
            endMessage={<p style={{ textAlign: 'center', margin: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', fontFamily: 'Restora, serif', fontSize: '20px', fontWeight: 'bold' }}>END</p>}
          >
            <Grid container spacing={2}>
              {data?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group &&
                    group.data.map((pokemon: PokemonHome) => {
                      if (!pokemon.sprites || !pokemon.sprites.other || !pokemon.sprites.other.home || !pokemon.sprites.other.home.front_default) {
                        return null;
                      }
                      const isFavorite = isLogin ? favoritePokemon.some((favPokemon: any) => favPokemon.id === pokemon.id) : false;
                      return (
                        <Grid item key={pokemon?.id} xs={5.85} sm={4} md={3} lg={2}>
                          <Paper
                            elevation={7}
                            sx={{
                              backgroundColor: 'rgb(250, 230, 230)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '10px',
                              width: '215px',
                              height: '330px',
                              border: '10px solid white'
                            }}
                          >
                            <div style={{ position: 'relative' }}>
                              <Link to={`/pokemon/${pokemon.id}`} style={{ position: 'absolute', top: -6, left: -30, color: 'grey' }} >
                                <InfoOutlinedIcon />
                              </Link>
                              {pokemon.sprites && pokemon.sprites.other && (
                                <CardMedia
                                  component="img"
                                  height="150"
                                  width="150"
                                  image={pokemon?.sprites.other.home.front_default}
                                  alt={pokemon?.species.name}
                                />
                              )}
                            </div>
                            <IconButton
                              sx={{ color: isFavorite ? 'red' : '#415050', marginBottom: '-10px' }}
                              aria-label="favorite"
                              onClick={() => handleFavoriteClick(pokemon)}
                              title={isFavorite ? 'Delete from My Pokemon List' : 'Add to My Pokemon List'}
                            >
                              {isFavorite ? <CatchingPokemonIcon /> : <CatchingPokemonIcon />}
                            </IconButton>
                            {pokemon.species && (
                              <Typography variant="h6" component="h6" sx={{ mt: 0, fontFamily: 'Restora, serif', fontSize: '30px', fontStyle: 'italic', fontWeight: 'bold' }}>
                                {pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)}
                              </Typography>
                            )}
                            {pokemon.stats && (
                              <Box mt={0} display="flex">
                                <Box>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>HP:</Typography>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>ATK:</Typography>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>DEF:</Typography>
                                </Box>
                                <Box marginLeft={1}>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>{pokemon.stats[0].base_stat}</Typography>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>{pokemon.stats[1].base_stat}</Typography>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>{pokemon.stats[2].base_stat}</Typography>
                                </Box>
                                <Box marginLeft={2}>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>SP-ATK:</Typography>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>SP-DEF:</Typography>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>SPD:</Typography>
                                </Box>
                                <Box marginLeft={1}>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>{pokemon.stats[3].base_stat}</Typography>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>{pokemon.stats[4].base_stat}</Typography>
                                  <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '19px', fontWeight: 'bold' }}>{pokemon.stats[5].base_stat}</Typography>
                                </Box>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      );
                    })}
                </React.Fragment>
              ))}
            </Grid>
          </InfiniteScroll>
        )}
        <ToastContainer autoClose={1000} />
      </div>
    </>
  );
};

export default PokemonList;