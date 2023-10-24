import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';



export default function App() {
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);  //This is the list of the pokemon
  const [nextPokenmonUrl, setnextPokenmonUrl] = useState(null); //This is the next pokemon list where new pokemon will show up
  const [showModal, setShowModal] = useState(false);   //This will help when we will check for more details by clicking show more 
  const [selectedPokemon, setselectedPokemon] = useState(null); //This will help in which pokemon is selected and what we will do with that pokemon like using its image etc

  async function getAllPokemons(url = "https://content.newtonschool.co/v1/pr/64ccef982071a9ad01d36ff6/pokemonspages1", override = false) {
    const res = await axios.get(url);      // I used axios instead of asyn and await this works the same only thing is to install dependency
    const pokemonData = res.data[0].results;
    setnextPokenmonUrl(res.data[0].next);
    const pokemonListFromApi = [];
    for (const pokemon of pokemonData) {
      const res = await axios.get(pokemon.url);
      const data = res.data[0];
      pokemonListFromApi.push(data);
    }
    //Till here I was fetching the api 
    console.log(pokemonListFromApi);
    if (!override) {
      setPokemonList(pokemonListFromApi)
    }// This one just findds out whether its overiding or not 
    else {
      setPokemonList((oldList) => {
        return oldList.concat(pokemonListFromApi);
      })  // if Its overRiding then it would make sure that the old state is not getting erased like it would make sure that other images are in the same continuity, and not make it overiding the old state
    }
    setLoading(false);
  }

  function handleShowMore() {
    getAllPokemons(nextPokenmonUrl, true);
  }

  useEffect(() => {
    getAllPokemons();     //This make sures thats  everything shows up
  }, [])

  return loading ? <div>loading</div> : <div id="parent">
    <div id="section">
      <div class="pokemon">
        <h2>Pokemon</h2>
        <h2>Pokemon</h2>
      </div>

      <div class="kingdom">
        <h2>Kingdom</h2>
        <h2>Kingdom</h2>
      </div>
    </div>
    {/* {here fetching all the name of the modal as well as there hp and other things} */}
    <div className="modal" id={showModal === false && "inactive"}>
      <div className="content">
        {selectedPokemon !== null && selectedPokemon >= 0 && <div className={`details ${pokemonList[selectedPokemon].type}`}>
          <div id="pokemon-preview">
            <img src={pokemonList[selectedPokemon].image} alt={pokemonList[selectedPokemon].name} />
            <div>{pokemonList[selectedPokemon].name}</div>

          </div>

          <div className='stats'>
            <div>
              <h5>Weight:  {pokemonList[selectedPokemon].weight}</h5>
              <h5>Height:  {pokemonList[selectedPokemon].height}</h5>
            </div>

            <div >
              {pokemonList[selectedPokemon].stats.map((stats, index) => {
                return <h5>Stat{index + 1}: {stats.stat.name}</h5>
              })}
            </div>
            <div className='some2'>
              {pokemonList[selectedPokemon].stats.map((stats, index) => {
                return <h5>Bs{index + 1}: {stats.base_stat}</h5>
              })}
            </div>
          </div>

          <div id="close" onClick={() => {
            setShowModal(false);   // It will update the showModal
            setselectedPokemon(null); //it would make the selected pokemon list as null so new list would be able to cop up
          }}>x</div>
        </div>
        }
      </div>
    </div>



    <div className="app-container" id="no-scrool">
      <div className="pokemon-container" >
        {pokemonList.map((pokemon, index) => {
          return <div className={`card ${pokemon.type}`}>
            <div className="number">{`#${pokemon.id}`}</div>
            <img src={pokemon.image} alt={pokemon.name} />
            <div className="details">
              <h3>{pokemon.name}</h3>
              <small>Type: {pokemon.type}</small>
            </div>
            <div>
              <button className="btn fancy" onClick={() => {
                setShowModal(true);
                setselectedPokemon(index);
              }}>show more</button>
            </div>
          </div>
        })}
      </div>
    </div>


    <div className="center">
      <div>
        <button className="btn fancy" onClick={handleShowMore}>Show more</button>
      </div>
    </div>


  </div>
}

