import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Components/style.css";
import SearchBar from "./Components/SearchBar";
import FilterPokemon from "./Components/FilterPokemon";
import { Stats } from "./Components/Stats";

const colorTypes = {
  normal: "#A8A878",
  poison: "#A040A0",
  bug: "#A8B820",
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  dark: "#e13535",
  ground: "#E0C068",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  ghost: "#705898",
  ice: "#98D8D8",
  steel: "#B8B8D0",
  dragon: "#7038F8",
  flying: "#A890F0",
  default: "#e13535",
};

const formateName = (name) => {
  return `${name[0].toUpperCase()}${name.slice(1)}`;
};

const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [offSet, sestOffSet] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filterResultCount, setFilterResultcount] = useState(0);
  const [searchState, setSearchState] = useState([]);
  const [filterState, setFilterState] = useState("all");
  const [filterData, setFilterData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [types, setTypes] = useState([]);

  const pokemonTypes = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/type");
    const { results } = await res.json();
    const allTypes = results.map(({ name }) => {
      return { label: formateName(name), value: name };
    });
    allTypes.push({ label: "Default", value: "all" });
    setTypes(allTypes);
  };

  const fetchPokemon = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offSet}&limit=20`
    );
    const { results = [], count } = await response.json();
    const promiseList = results?.map(({ url = "" }) => fetch(url));
    const pokemonResponse = await Promise.all(promiseList);
    const pokemonData = await Promise.all(
      pokemonResponse.map((pokemon) => pokemon.json())
    );
    setPokemon((pokemon = []) => [...pokemon, ...pokemonData]);
    setTotalCount(count);
    sestOffSet((offSet) => offSet + 20);
  };

  const filter = async () => {
    setSearchState([]);
    if (filterState === "all") {
      setFilterData([]);
    } else {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${filterState}`);
      const { pokemon: data = [] } = await res.json();
      const count = data.length;
      const promiseList = data?.map(({ pokemon: { url = "" } = {} }) =>
        fetch(url)
      );
      const pokemonResponse = await Promise.all(promiseList);
      const pokemonData = await Promise.all(
        pokemonResponse.map((pokemon) => pokemon.json())
      );
      setFilterData(pokemonData);
      setFilterResultcount(count);
    }
  };

  useEffect(() => {
    pokemonTypes();
    fetchPokemon();
  }, []);

  useEffect(() => {
    filter();
  }, [filterState]);

  return (
    <div style={{ padding: 20 }}>
      <h1
        style={{ fontSize: 25, textAlign: "center", fontFamily: "sans-serif" }}
      >
        Pokemon Cards
      </h1>
      <div className="searchFilter">
        <SearchBar output={{ setSearchState, setFilterState }} />
        <FilterPokemon
          key={filterState}
          data={{ setFilterState, filterState, types }}
        />
      </div>
      <br />
      <InfiniteScroll
        dataLength={
          (filterData && filterData.length) ||
          (searchState && searchState.length) ||
          pokemon.length
        }
        next={fetchPokemon}
        hasMore={
          filterData.length
            ? filterResultCount > filterData.length
            : searchState.length
            ? searchState.length > 1
            : totalCount > pokemon.length
        }
        loader={<div>Loding....</div>}
      >
        {searchState.length || filterData.length ? (
          <div className="container">
            {(searchState.length ? searchState : filterData)?.map(
              (poke, index) => {
                const { id = "", name = "", types = [] } = poke || {};
                const [{ type: { name: colorName = "default" } } = {}] =
                  types || [];
                const color = colorTypes[colorName];
                return (
                  <div
                    className="flexbox"
                    key={id}
                    style={{
                      cursor: "pointer",
                      backgroundColor: color,
                      boxShadow: `${color} 0px 0px 16px`,
                    }}
                    onClick={() => {
                      setModalData(poke);
                      setModalOpen(true);
                    }}
                  >
                    <div style={{ paddingLeft: 10, paddingTop: 30 }}>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {formateName(name)}
                      </div>
                      <div>
                        {types?.map(
                          ({ type: { name: typeName = "" } = {} } = {}) => (
                            <div className="types">{formateName(typeName)}</div>
                          )
                        )}
                      </div>
                    </div>
                    <div style={{ position: "relative" }}>
                      <div className="id">#{id}</div>
                      <img
                        className="cardImage"
                        alt={name}
                        src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${id}.svg`}
                        style={{ marginTop: 40 }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="container">
            {pokemon?.map((poke, index) => {
              const { id = "", name = "", types = [] } = poke || {};
              const [{ type: { name: colorName = "default" } } = {}] =
                types || [];
              const color = colorTypes[colorName];
              return (
                <div
                  className="flexbox"
                  key={id}
                  style={{
                    cursor: "pointer",
                    backgroundColor: color,
                    boxShadow: `${color} 0px 0px 16px`,
                  }}
                  onClick={() => {
                    setModalData(poke);
                    setModalOpen(true);
                  }}
                >
                  <div style={{ paddingLeft: 10, paddingTop: 30 }}>
                    <div
                      style={{ fontSize: 24, fontWeight: 700, color: "white" }}
                    >
                      {formateName(name)}
                    </div>
                    <div>
                      {types?.map(
                        ({ type: { name: typeName = "" } = {} } = {}) => (
                          <div className="types">{formateName(typeName)}</div>
                        )
                      )}
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <div className="id">#{id}</div>
                    <img
                      className="cardImage"
                      alt={name}
                      src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${id}.svg`}
                      style={{ marginTop: 40 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </InfiniteScroll>
      {modalOpen && (
        <Modal
          width="650px"
          footer={""}
          centered
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setModalData({});
          }}
        >
          <div className="statImage">
            <img
              alt={modalData.name}
              src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${modalData.id}.svg`}
              className="modalImage"
            />
            <Stats data={modalData} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
