import React from 'react';
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
    console.log(flavorSpeech)

    return (
        <div style={{ padding: '140px 60px 0px 60px' }}>
            <Grid container spacing={5}>
                <Grid item xs={4}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                    }}
                >
                    <CardMedia
                        component="img"
                        height="500"
                        width="500"
                        image={pokemonData?.sprites.other.home.front_default}
                        alt={pokemonData?.species.name}
                        sx={{paddingBottom:'10px'}}
                    />
                    <Typography variant="h6" component="h6" sx={{ mt: 1, fontSize: '50px' }}>
                        {pokemonData?.species?.name}
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Grid container spacing={19}>
                                <Grid item xs={8}>
                                    <Typography variant='h5'>
                                        Bio
                                    </Typography>
                                    <Typography variant="h6" component="h6" sx={{ mt: 1 }}>
                                        {flavorSpeech}
                                    </Typography>
                                    <Typography variant='h6'>
                                        Genus: {pokemonSpecies?.genera?.filter((entry: any) => entry.language.name === "en")[0].genus}
                                    </Typography>
                                    <Typography variant='h6'>
                                        Weight: {pokemonData.weight / 10}kg
                                    </Typography>
                                    <Typography variant='h6'>
                                        Height: {pokemonData.height / 10}m
                                    </Typography>
                                    <Typography variant="h6">Abilities: {pokemonData.abilities.map((ability: any) => (
                                        <Typography key={ability.slot}>{ability.ability.name}</Typography>
                                    ))}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant='h5'>
                                        Training
                                    </Typography>
                                    <Typography variant='h6'>
                                        Base Exp: {pokemonData?.base_experience}
                                    </Typography>
                                    <Typography variant='h6'>
                                        Base Happiness: {pokemonSpecies?.base_happiness}
                                    </Typography>
                                    <Typography variant='h6'>
                                        Capture Rate: {pokemonSpecies?.capture_rate}
                                    </Typography>
                                    <Typography variant='h6'>
                                        Growth Rate: {pokemonSpecies?.growth_rate?.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            {pokemonData.stats && (
                                <Box mt={2}>
                                    <Typography variant="h6">Stats</Typography>
                                    {pokemonData.stats.map((stat: any) => (
                                        <Box key={stat.stat.name} display="flex" flexDirection="row" alignItems="center">
                                            <Typography>{stat.stat.name}:</Typography>
                                            <Typography>{stat.base_stat}</Typography>
                                        </Box>
                                    ))}
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