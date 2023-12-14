import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import PokemonList from './pages/PokemonList/PokemonList';
import MyPokemonList from './pages/MyPokemonList/MyPokemonList';
import PokemonDetail from './pages/PokemonDetail/PokemonDetail';
import Navbar from './components/Navbar/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TypePokemon from "./pages/Type/Type";
import { useState } from "react";
const queryClient = new QueryClient()

function App() {
  const [refreshComponent, setRefreshComponent] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar
        setRefreshComponent={setRefreshComponent}
        refreshComponent={refreshComponent} />
      <Routes>
        <Route path="/" element={<HomePage
        />} />
        <Route path="/pokemon" element={<PokemonList
          refresh={refreshComponent}
        />} />
        <Route path="/my-pokemon" element={<MyPokemonList
          refresh={refreshComponent}
        />} />
        <Route path="/pokemon/:id" element={<PokemonDetail
          refresh={refreshComponent}
        />} />
        <Route path="/pokemon/type/:id" element={<TypePokemon
          refresh={refreshComponent}
        />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
