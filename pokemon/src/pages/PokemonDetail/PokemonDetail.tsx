import { Box, Typography, Grid, CardMedia, IconButton } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSelector, useDispatch } from 'react-redux'
import { addFavorite, deleteFavorite } from '../../redux/Slice/pokemonSlice'
import { PokemonHome } from "../../interface/interface";
import { ToastContainer, toast } from 'react-toastify';

const PokemonDetail = () => {
    const favoritePokemon = useSelector((state: any) => state.favorite.value)
    const dispatch = useDispatch()
    const { id } = useParams();
    const { isLoading, isError, data: pokemonData = [], error } = useQuery({
        queryKey: ['pokeData'],
        queryFn: () =>
            fetch('https://pokeapi.co/api/v2/pokemon/' + id)
                .then((res) => res.json())
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

    const isFavorite = favoritePokemon.some((favPokemon: any) => favPokemon.id === pokemonData.id);

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
        <div style={{ padding: '140px 60px 0px 60px' }}>
            <Grid container spacing={5}>
                <Grid item xs={4}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <CardMedia
                        component="img"
                        height="500"
                        width="500"
                        image={pokemonData?.sprites.other.home.front_default}
                        alt={pokemonData?.species.name}
                        sx={{ paddingBottom: '10px' }}
                    />
                    <Typography variant="h6" component="h6" sx={{ mt: 1, fontSize: '50px' }}>
                        {pokemonData?.species?.name}
                    </Typography>
                    <IconButton
                        sx={{ color: isFavorite ? 'red' : 'grey' }}
                        aria-label="favorite"
                        onClick={() => handleFavoriteClick(pokemonData)}
                        title={isFavorite ? 'Delete from My Pokemon List' : 'Add to My Pokemon List'}
                    >
                        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                    </IconButton>
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Grid container spacing={19}>
                                <Grid item xs={6}>
                                    <Typography>
                                        <Typography sx={{ fontSize: '50px' }}>
                                            Bio
                                        </Typography>
                                        <Typography sx={{ mt: 1 }}>
                                            {flavorSpeech}
                                        </Typography>
                                    </Typography>
                                    <Typography display="flex" alignItems="center">
                                        <Typography style={{ marginRight: '40px' }}>
                                            Genus:
                                        </Typography>
                                        <Typography>
                                            {pokemonSpecies?.genera?.filter((entry: any) => entry.language.name === "en")[0].genus}
                                        </Typography>
                                    </Typography>
                                    <Typography display="flex" alignItems="center">
                                        <Typography style={{ marginRight: '40px' }}>
                                            Weight:
                                        </Typography>
                                        <Typography>
                                            {pokemonData.weight / 10}kg
                                        </Typography>
                                    </Typography>
                                    <Typography display="flex" alignItems="center">
                                        <Typography style={{ marginRight: '40px' }}>
                                            Height:
                                        </Typography>
                                        <Typography>
                                            {pokemonData.height / 10}m
                                        </Typography>
                                    </Typography>
                                    <Typography display="flex" alignItems="center">Abilities: {pokemonData.abilities.map((ability: any) => (
                                        <Typography style={{ marginLeft: '30px' }} key={ability.slot}>{ability.ability.name}</Typography>
                                    ))}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontSize: '50px' }}>
                                        Training
                                    </Typography>
                                    <Typography sx={{ mt: 1 }} display="flex" alignItems="center">
                                        <Typography style={{ marginRight: '100px' }}>
                                            Base Exp:
                                        </Typography>
                                        <Typography>
                                            {pokemonData?.base_experience}
                                        </Typography>
                                    </Typography>
                                    <Typography display="flex" alignItems="center">
                                        <Typography style={{ marginRight: '50px' }}>
                                            Base Happiness:
                                        </Typography>
                                        <Typography>
                                            {pokemonSpecies?.base_happiness}
                                        </Typography>
                                    </Typography>
                                    <Typography display="flex" alignItems="center">
                                        <Typography style={{ marginRight: '75px' }}>
                                            Capture Rate:
                                        </Typography>
                                        <Typography>
                                            {pokemonSpecies?.capture_rate}
                                        </Typography>
                                    </Typography>
                                    <Typography display="flex" alignItems="center">
                                        <Typography style={{ marginRight: '80px' }}>
                                            Growth Rate:
                                        </Typography>
                                        <Typography>
                                            {pokemonSpecies?.growth_rate?.name}
                                        </Typography>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            {pokemonData.stats && (
                                <Box mt={2}>
                                    <Typography sx={{ fontSize: '50px' }}>Stats</Typography>
                                    <Typography display="flex" alignItems="center">
                                        {pokemonData.stats.map((stat: any) => (
                                            <Box key={stat.stat.name} style={{ marginRight: '80px' }}>
                                                <Typography>{stat.stat.name}:</Typography>
                                                <Typography>{stat.base_stat}</Typography>
                                            </Box>
                                        ))}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <ToastContainer autoClose={1000} />
        </div>
    );
};

export default PokemonDetail;