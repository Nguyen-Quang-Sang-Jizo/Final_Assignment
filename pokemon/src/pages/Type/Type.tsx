import { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Typography, Grid, Paper, IconButton, CardMedia, CircularProgress, Box } from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PokemonHome } from '../../interface/interface';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from 'react-router-dom';

interface Props {
    refresh: boolean;
}

const TypePokemon = ({ refresh }: Props) => {
    const { id } = useParams();
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

    const { data: pokemonData = [], error, status, refetch } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch(`https://pokeapi.co/api/v2/type/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    const results = data?.pokemon;
                    const requests = results.map((result: any) => axios.get(result.pokemon.url));
                    return Promise.all(requests).then((pokemonResponses) =>
                        pokemonResponses.map((pokemonRes) => pokemonRes.data)
                    );
                }),
    });

    useEffect(() => {
        refetch();
    }, [id]);

    useEffect(() => {
        setFavoritePokemon(fav.data)
    }, [refresh])


    const handleFavoriteClick = async (pokemon: PokemonHome) => {
        if (isLogin == '') {
            toast.warning('Please log in to add to My Pokemon List');
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
        <div style={{ padding: '75px 20px' }}>
            {status === 'pending' ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <CircularProgress />
                </div>
            ) : status === 'error' ? (
                <p>Error: {error.message}</p>
            ) : (
                <Grid container spacing={2}>
                    {pokemonData && Object.values(pokemonData).map((pokemon: PokemonHome) => {
                        if (!pokemon.sprites || !pokemon.sprites.other || !pokemon.sprites.other.home || !pokemon.sprites.other.home.front_default) {
                            return null;
                        }
                        const isFavorite = isLogin ? favoritePokemon.some((favPokemon: any) => favPokemon.id === pokemon.id) : false;
                        return (
                            <Grid item key={pokemon?.id} xs={5.85} sm={4} md={3} lg={2}>
                                <Paper
                                    elevation={7}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgb(250, 230, 230)',
                                        borderRadius: '10px',
                                        width: '215px',
                                        height: '330px',
                                        border: '10px solid white'
                                    }}
                                    className='paper'
                                >
                                    <div style={{ position: 'relative' }}>
                                        <Link to={`/pokemon/${pokemon.id}`} style={{ position: 'absolute', top: -10, left: -30, color: 'grey' }} >
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
                                        <Typography variant="h6" component="h6" sx={{ mt: 1, fontFamily: 'Restora, serif', fontSize: '22px', fontStyle: 'italic', fontWeight: 'bold' }}>
                                            {pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)}
                                        </Typography>
                                    )}
                                    {pokemon.stats && (
                                        <Box mt={2} display="flex">
                                            <Box>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>HP:</Typography>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>ATK:</Typography>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>DEF:</Typography>
                                            </Box>
                                            <Box marginLeft={2}>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{pokemon.stats[0].base_stat}</Typography>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{pokemon.stats[1].base_stat}</Typography>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{pokemon.stats[2].base_stat}</Typography>
                                            </Box>
                                            <Box marginLeft={4}>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>SP-ATK:</Typography>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>SP-DEF:</Typography>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>SPD:</Typography>
                                            </Box>
                                            <Box marginLeft={2}>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{pokemon.stats[3].base_stat}</Typography>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{pokemon.stats[4].base_stat}</Typography>
                                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{pokemon.stats[5].base_stat}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
            <ToastContainer autoClose={1000} />
        </div>
    );
};

export default TypePokemon;