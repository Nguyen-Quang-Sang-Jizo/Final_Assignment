import { useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PokemonHome } from '../../interface/interface';
import {
  Typography,
  Grid,
  Paper,
  IconButton,
  CardMedia,
  Modal,
  Button
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { updateNameFavorite } from '../../redux/Slice/pokemonSlice'


interface Props {
  favoritePokemon: PokemonHome;
  handleConfirmFavorite: (pokemon: PokemonHome) => void;
}

export const SortableItem = ({ favoritePokemon, handleConfirmFavorite }: Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const openModalRef = useRef(false);
  const openModalz = openModalRef.current;

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

  const Edit = (data: any) => {
    dispatch(updateNameFavorite({ id: favoritePokemon.id, newName: data.name }));
    handleCloseEditModal();
  };

  return (
    <Grid
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      item
      key={favoritePokemon.id}
      xs={5}
      sm={3}
      md={2.4}
      lg={1.5}
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
          borderRadius: '25%',
          width: '172px',
          height: '172px'
        }}
      >
        <div onMouseUp={() => { handleNavigation(`/pokemon/${favoritePokemon.id}`) }}>
          <CardMedia
            component="img"
            height="100px"
            width="100px"
            image={favoritePokemon?.sprites.other.home.front_default}
            alt={favoritePokemon.species.name}
            sx={{
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.2)',
              },
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '38px' }}>
          <Typography variant="h6" component="h6" sx={{
            mt: 1, fontFamily: 'Monaco', fontSize: '20px'
          }}>
            {favoritePokemon.species.name}
          </Typography>
          <IconButton
            sx={{ color: 'green',paddingRight: '0px', marginLeft: 'auto'  }}
            onMouseUp={handleOpenEditModal}
            title="Edit"
          >
            <EditIcon sx={{ width: '15x', height: '15px' }} />
          </IconButton>
        </div>
        <IconButton
          sx={{ color: 'red' }}
          onMouseUp={handleOpenModal}
          title="Delete from My Pokemon List"
        >
          <FavoriteIcon />
        </IconButton>
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
            width: '300px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" id="edit-modal-title">
            Edit Name
          </Typography>
          <form onSubmit={handleSubmit(Edit)}>
            <input
            placeholder='Pokemion Name ...'
              type="text"
              defaultValue={favoritePokemon.species.name}
              {...register('name', { required: true, maxLength: 10 })}
            />
            <br />
            {errors.name && <span>0 &lt; character &lt; 10</span>}
            <br />
            <Button onClick={handleCloseEditModal}>Cancel</Button>
            <Button type="submit">Save</Button>
          </form>
        </div>
      </Modal>
    </Grid >
  );
};