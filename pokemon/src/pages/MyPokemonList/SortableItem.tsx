import { useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PokemonHome } from '../../interface/interface';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Typography,
  Grid,
  Paper,
  IconButton,
  CardMedia,
  Modal,
  Button,
  Box
} from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import EditIcon from '@mui/icons-material/Edit';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


interface Props {
  favoritePokemon: PokemonHome;
  handleConfirmFavorite: (pokemon: PokemonHome) => void;
}

export const SortableItem = ({ favoritePokemon, handleConfirmFavorite }: Props) => {
  const navigate = useNavigate();
  const openModalRef = useRef(false);
  const openModalz = openModalRef.current;
  const isLogin = localStorage.getItem('isLogin') ?? '';
  const list = localStorage.getItem(isLogin) ?? '';
  const fav = JSON.parse(list);
  const [favPokemon, setFavoritePokemon] = useState(favoritePokemon.species.name);



  const handleNavigation = (value: any) => {
    navigate(value);
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable(
    { id: favoritePokemon.id, disabled: openModalz, }
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenEditModal = () => {
    openModalRef.current = true;
    setIsEditing(true);
  };

  const handleCloseEditModal = () => {
    openModalRef.current = false;
    setIsEditing(false);
  };

  const { register, handleSubmit, formState: { errors } } = useForm();

  const Edit = async(data: any) => {
    const index = fav.data.findIndex((favPokemon: any) => favPokemon.id === favoritePokemon.id);
    const updatedData = [...fav.data]
    updatedData[index].species.name = data.name;
    await setFavoritePokemon(data.name);
    const newData = JSON.stringify({ username: isLogin, data: updatedData })
    localStorage.setItem(isLogin, newData); handleCloseEditModal();
  };

  return (
    <Grid
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      item
      key={favoritePokemon.id}
      xs={5.85} sm={4} md={3} lg={2}
      sx={{
        padding: '10px',
      }}
    >
      <Paper
        elevation={3}
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
      >
        <div style={{ position: 'relative' }}>
          <div onMouseUp={() => { handleNavigation(`/pokemon/${favoritePokemon.id}`) }} style={{ position: 'absolute', top: -10, left: -30, color: 'grey' }} >
            <InfoOutlinedIcon />
          </div>
          <IconButton
            sx={{ color: 'grey', position: 'absolute', top: -10, right: -35, }}
            onMouseUp={handleOpenEditModal}
            title="Edit"
          >
            <EditIcon sx={{ width: '15x', height: '15px' }} />
          </IconButton>
          <CardMedia
            component="img"
            height="150px"
            width="150px"
            image={favoritePokemon?.sprites.other.home.front_default}
            alt={favoritePokemon.species?.name}
          />
        </div>
        <IconButton
          sx={{ color: 'red' }}
          onMouseUp={handleOpenModal}
          title="Delete from My Pokemon List"
        >
          <CatchingPokemonIcon />
        </IconButton>
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 'auto' }}>
          <Typography variant="h6" component="h6" sx={{
            fontSize: '22px',
            fontFamily: 'Restora, serif',
            fontStyle: 'italic',
            fontWeight: 'bold'
          }}
          >
            {favPokemon.charAt(0).toUpperCase() + favPokemon.slice(1)}
          </Typography>
        </div>
        {favoritePokemon.stats && (
          <Box mt={2} display="flex" sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>
            <Box>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>HP:</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>ATK:</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>DEF:</Typography>
            </Box>
            <Box marginLeft={2}>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{favoritePokemon.stats[0].base_stat}</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{favoritePokemon.stats[1].base_stat}</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{favoritePokemon.stats[2].base_stat}</Typography>
            </Box>
            <Box marginLeft={4}>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>SP-ATK:</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>SP-DEF:</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>SPD:</Typography>
            </Box>
            <Box marginLeft={2}>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{favoritePokemon.stats[3].base_stat}</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{favoritePokemon.stats[4].base_stat}</Typography>
              <Typography sx={{ fontFamily: 'Restora, serif', fontSize: '10px', fontWeight: 'bold' }}>{favoritePokemon.stats[5].base_stat}</Typography>
            </Box>
          </Box>

        )}
      </Paper>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '5px',
            outline: 'none',
            width: '300px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" id="confirmation-modal-title">
            Confirm Delete
          </Typography>
          <Typography variant="body1" id="confirmation-modal-description">
            Are you sure you want to remove {favoritePokemon.species.name} from favorite pokemon?
          </Typography>
          <Button onMouseUp={handleCloseModal}>Cancel</Button>
          <Button onMouseUp={() => handleConfirmFavorite(favoritePokemon)} sx={{ color: 'red' }}>Delete</Button>
        </div>
      </Modal>
      <Modal
        open={isEditing}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '5px',
            outline: 'none',
            width: '400px',
            textAlign: 'center',
            height: '150px',
          }}
        >
          <Typography variant="h6" id="edit-modal-title">
            Edit Name
          </Typography>
          <form onSubmit={handleSubmit(Edit)}>
            <input
              placeholder='Name ...'
              type="text"
              defaultValue={favoritePokemon.species.name}
              {...register('name', { required: true, maxLength: 11 })}
              style={{
                width: '100%',
                height: '50px',
                fontSize: '25px',
                fontFamily: 'Restora, serif',
                fontStyle: 'italic',
                fontWeight: 'bold'
              }}
            />
            <br />
            {errors.name && <span style={{ fontFamily: 'Restora, serif', fontSize: '20px', fontWeight: 'bold' }}>0 &lt; character &lt; 11</span>}
            <br />
            <Button onClick={handleCloseEditModal}>Cancel</Button>
            <Button type="submit" sx={{ color: 'green' }}>Save</Button>
          </form>
        </div>
      </Modal>
    </Grid >
  );
};