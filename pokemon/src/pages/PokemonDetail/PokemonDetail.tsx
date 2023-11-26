import { Box, Typography, Grid, CardMedia } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";


const PokemonDetail = () => {
    const { id } = useParams();
    const { isLoading, isError, data: pokemonData = [], error } = useQuery({
        queryKey: ['pokeData'],
        queryFn: () =>
            fetch('https://pokeapi.co/api/v2/pokemon/' + id)
                .then((res) => res.json())
    });

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
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Grid container spacing={19}>
                                <Grid item xs={6}>
                                    <Typography>
                                        <Typography sx={{fontSize:'50px'}}>
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
                                    <Typography  sx={{fontSize:'50px'}}>
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
                                    <Typography sx={{fontSize:'50px'}}>Stats</Typography>
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
        </div>
    );
};

export default PokemonDetail;