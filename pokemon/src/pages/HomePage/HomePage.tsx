import { Box, CardMedia, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const HomePage = () => {
  const id = Math.floor(Math.random() * 1292) + 1;
  const { data: pokemon = [] } = useQuery({
    queryKey: ['pokeData'],
    queryFn: () =>
      fetch('https://pokeapi.co/api/v2/pokemon/' + id)
        .then((res) => res.json()),
    refetchOnWindowFocus: true,
  });


  return (
    <div style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingTop: '90px'
    }}>
      <Paper
        elevation={7}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgb(250, 230, 230)',
          width: '500px',
          height: '650px',
          border: '15px solid white',
          borderRadius: '10px',
        }}
        className='paper'
      >
        <div style={{ position: 'relative' }}>
          <Link to={`/pokemon/${pokemon.id}`} style={{ position: 'absolute', top: 0, left: -40, color: 'grey' }} >
            <InfoOutlinedIcon />
          </Link>
          {pokemon.sprites && pokemon.sprites.other && (
            <CardMedia
              component="img"
              height="400"
              width="400"
              image={pokemon?.sprites.other.home.front_default}
              alt={pokemon?.species.name}
            />
          )}
        </div>
        {pokemon.species && (
          <Typography variant="h6" component="h6" sx={{ mt: 1, fontFamily: 'Restora, serif', fontSize: '60px', fontStyle: 'italic', fontWeight: 'bold' }}>
            {pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)}
          </Typography>
        )}
        {pokemon.stats && (
          <Box mt={2} display="flex">
            <Box>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>HP:</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>ATK:</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>DEF:</Typography>
            </Box>
            <Box marginLeft={2}>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>{pokemon.stats[0].base_stat}</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>{pokemon.stats[1].base_stat}</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>{pokemon.stats[2].base_stat}</Typography>
            </Box>
            <Box marginLeft={4}>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>SP-ATK:</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>SP-DEF:</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>SPD:</Typography>
            </Box>
            <Box marginLeft={2}>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>{pokemon.stats[3].base_stat}</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>{pokemon.stats[4].base_stat}</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '25px', fontWeight: 'bold' }}>{pokemon.stats[5].base_stat}</Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default HomePage;
