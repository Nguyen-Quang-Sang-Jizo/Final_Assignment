import { CardMedia, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const id = Math.floor(Math.random() * 1292) + 1;
  console.log(id);

  const { data: pokemon = []} = useQuery({
    queryKey: ['pokeData'],
    queryFn: () =>
      fetch('https://pokeapi.co/api/v2/pokemon/' + id)
        .then((res) => res.json()),
    refetchOnWindowFocus: true, 
  });

  return (
    <div style={{ padding: '90px 544px' }}>
      <Paper
        elevation={7}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgb(250, 230, 230)',
          width: '500px',
          height: '600px'
        }}
        className='paper'
      >
        <Link to={`/pokemon/${pokemon?.id}`}>
          {pokemon.sprites && pokemon.sprites.other && (
            <CardMedia
              component="img"
              height="400"
              width="400"
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
          <Typography variant="h6" component="h6" sx={{ mt: 1, fontFamily: 'Monaco', fontSize: '100px' }}>
            {pokemon.species.name}
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default HomePage;
