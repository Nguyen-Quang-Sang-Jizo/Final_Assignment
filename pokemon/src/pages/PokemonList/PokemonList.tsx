import React from 'react';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Typography, Grid, Paper, IconButton, CardMedia, Button, CircularProgress } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { PokemonHome, Results } from '../../interface/interface';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector, useDispatch } from 'react-redux'
import { addFavorite, deleteFavorite } from '../../redux/Slice/pokemonSlice'

const PokemonList = () => {
  const favoritePokemon = useSelector((state: any) => state.favorite.value)
  const dispatch = useDispatch()

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=40`);
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
    if (favoritePokemon.some((favPokemon: any) => favPokemon.id === pokemon.id)) {
      dispatch(deleteFavorite(pokemon.id));
      toast.success('Delete success!');
    } else {
      dispatch(addFavorite(pokemon));
      toast.success('Add to success!');
    }
  };

  return (
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
          endMessage={<p>Nothing more to load</p>}
        >
          <Grid container spacing={2}>
            {data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group &&
                  group.data.map((pokemon: PokemonHome) => {
                    const isFavorite = favoritePokemon.some((favPokemon: any) => favPokemon.id === pokemon.id);
                    return (
                      <Grid item key={pokemon?.id} xs={5} sm={3} md={2.4} lg={1.5}>
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
              </React.Fragment>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default PokemonList;