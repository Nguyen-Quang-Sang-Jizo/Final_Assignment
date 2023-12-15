export interface PokemonHome {
  id: number;
  species: {
    name: string;
  };
  sprites: {
    other: {
      home: {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  stats: any
}

export interface Results {
  name: string;
  url: string;
}

export interface PokemonSpeciesData {
  base_happiness: number
  capture_rate: number
  evolution_chain: {
    url: string
  }
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string
    }
  }
  gender_rate: number
  generation: {
    name: string;
    url: string
  }
  growth_rate: {
    name: string;
    url: string
  }
  is_legendary: boolean
  is_mythical: boolean
  shape: {
    name: string;
    url: string
  }
  genera: {
    genus: string;
    language: {
      name: string
      url: string
    }
  }
}
