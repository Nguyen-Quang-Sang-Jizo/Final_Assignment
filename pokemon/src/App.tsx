import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import PokemonList from './pages/PokemonList/PokemonList';
import MyPokemonList from './pages/MyPokemonList/MyPokemonList';
import PokemonDetail from './pages/PokemonDetail/PokemonDetail';
import Navbar from './components/Navbar/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TypePokemon from "./pages/Type/Type";
const queryClient = new QueryClient()




function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon" element={<PokemonList/>} />
        <Route path="/my-pokemon" element={<MyPokemonList/>} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/type/:id" element={<TypePokemon />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
