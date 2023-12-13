import { Box, Typography, Grid, CardMedia, IconButton, Paper } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { PokemonHome } from "../../interface/interface";
import { ToastContainer, toast } from 'react-toastify';
import { useState } from "react";
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';

const PokemonDetail = () => {
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

    const { id } = useParams();
    const { isLoading, isError, data: pokemonData = [], error } = useQuery({
        queryKey: ['pokeData'],
        queryFn: () =>
            fetch('https://pokeapi.co/api/v2/pokemon/' + id)
                .then((res) => res.json())
    });

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

    const { data: pokemonSpecies = [] } = useQuery({
        queryKey: ['pokeSpacies'],
        queryFn: () =>
            fetch('https://pokeapi.co/api/v2/pokemon-species/' + id)
                .then((res) => res.json())
    });

    if (isLoading) {
        return <span>Loading...</span>;
    }

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    const isFavorite = isLogin ? favoritePokemon.some((favPokemon: any) => favPokemon.id === pokemonData.id) : false;

    const getFlavorSpeech = () => {
        const enLang = pokemonSpecies?.flavor_text_entries?.filter(
            (entry: any) => entry.language.name === "en"
        )[0]
        const pokeData = pokemonData.types.map((type: any) => (
            type.type.name
        ))
        const types = pokeData.join(" and ")
        const legend = pokemonSpecies.is_legendary ? " legendary, " : ""
        const mythic = pokemonSpecies.is_mythical ? " mythical, " : ""
        const text = `${pokemonData.name
            }, ${legend}${mythic}${types} type pokemon. ${enLang?.flavor_text?.replace(/\r?\n|\r/g, " ")}`
        return text
    }

    const flavorSpeech = getFlavorSpeech();

    return (
        <div style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: '75px'
        }}>
            <Paper
                elevation={7}
                sx={{
                    backgroundColor: 'rgb(250, 230, 230)',
                    width: '700px',
                    height: '680px',
                    border: '15px solid white',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                className='paper'
            >
                <div>
                <CardMedia
                    component="img"
                    height="200"
                    width="200"
                    image={pokemonData?.sprites.other.home.front_default}
                    alt={pokemonData?.species.name}
                />
                </div>
                <Typography variant="h6" component="h6" sx={{ mt: 2, fontFamily: 'Restora, serif', fontStyle: 'italic',fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>
                    {pokemonData?.species?.name}
                </Typography>
                <IconButton
                    sx={{ color: isFavorite ? 'red' : 'grey', marginTop: '-10px' }}
                    aria-label="favorite"
                    onClick={() => handleFavoriteClick(pokemonData)}
                    title={isFavorite ? 'Delete from My Pokemon List' : 'Add to My Pokemon List'}
                >
                    {isFavorite ? <CatchingPokemonIcon /> : <CatchingPokemonIcon />}
                </IconButton>
                <Typography sx={{fontFamily: 'Restora, serif', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '-10px', textAlign: 'center' }}>
                    Bio
                </Typography>
                <Box mt={2} display="flex" justifyContent="center">
                    <Box sx={{width:'180px', height:'100px'}}>
                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', lineHeight: '1.5' }}>
                            {flavorSpeech}
                        </Typography>
                    </Box>
                    <Box marginLeft={10}>
                        <Box mt={2} display="flex" justifyContent="center">
                            <Box>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '-18px' }}>Genus:</Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '6px' }}>Weight:</Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '6px' }}>Height:</Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '6px' }}>Abilities:</Typography>
                            </Box>
                            <Box marginLeft={2}>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '-18px' }}>
                                    {pokemonSpecies?.genera?.filter((entry: any) => entry.language.name === "en")[0].genus}
                                </Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '6px' }}>
                                    {pokemonData.weight / 10}kg
                                </Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '6px' }}>
                                    {pokemonData.height / 10}m
                                </Typography>
                                {pokemonData.abilities.map((ability: any) => (
                                    <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '6px' }} key={ability.slot}>
                                        {ability.ability.name}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box mt={2} display="flex" justifyContent="center">
                    <Box>
                        <Typography sx={{fontFamily: 'Restora, serif',  fontSize: '1.5rem', fontWeight: 'bold', marginTop: '20px', textAlign: 'center' }}>
                            Training
                        </Typography>
                        <Box mt={2} display="flex" justifyContent="center">
                            <Box>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold' }}>Base Exp:</Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }}>Base Happiness:</Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }}>Capture Rate:</Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }}>Growth Rate:</Typography>
                            </Box>
                            <Box marginLeft={2}>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal' }}>
                                    {pokemonData?.base_experience}
                                </Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '2px' }}>
                                    {pokemonSpecies?.base_happiness}
                                </Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '2px' }}>
                                    {pokemonSpecies?.capture_rate}
                                </Typography>
                                <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '2px' }}>
                                    {pokemonSpecies?.growth_rate?.name}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box marginLeft={10}>
                        {pokemonData.stats && (
                            <Box mt={2}>
                                <Typography sx={{fontFamily: 'Restora, serif', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '20px', textAlign: 'center' }}>
                                    Stats
                                </Typography>
                                <Box mt={2} display="flex" justifyContent="center">
                                    <Box>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold' }}>HP:</Typography>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' }}>ATK:</Typography>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' }}>DEF:</Typography>
                                    </Box>
                                    <Box marginLeft={2}>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal' }}>
                                            {pokemonData.stats[0].base_stat}
                                        </Typography>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '10px' }}>
                                            {pokemonData.stats[1].base_stat}
                                        </Typography>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '10px' }}>
                                            {pokemonData.stats[2].base_stat}
                                        </Typography>
                                    </Box>
                                    <Box marginLeft={4}>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold' }}>SP-ATK:</Typography>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' }}>SP-DEF:</Typography>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' }}>SPD:</Typography>
                                    </Box>
                                    <Box marginLeft={2}>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal' }}>
                                            {pokemonData.stats[3].base_stat}
                                        </Typography>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '10px' }}>
                                            {pokemonData.stats[4].base_stat}
                                        </Typography>
                                        <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '1rem', fontWeight: 'normal', marginTop: '10px' }}>
                                            {pokemonData.stats[5].base_stat}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Paper>
            <ToastContainer autoClose={1000} />
        </div >
    );
};

export default PokemonDetail;