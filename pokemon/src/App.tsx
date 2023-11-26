import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import PokemonList from './pages/PokemonList/PokemonList';
import MyPokemonList from './pages/MyPokemonList/MyPokemonList';
import PokemonDetail from './pages/PokemonDetail/PokemonDetail';
import Navbar from './components/Navbar/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PokemonHome } from "./interface/interface";
const queryClient = new QueryClient()




function App() {
  const [favoritePokemon, setFavoritePokemon] = useState<PokemonHome[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon" element={<PokemonList/>} />
        <Route path="/my-pokemon" element={<MyPokemonList/>} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
