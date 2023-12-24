import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

const SearchBar = (props) => {
  const {
    output: { setSearchState = () => {}, setFilterState = () => {} } = {},
  } = props || [];
  const [search, setSearch] = useState([]);

  const onSearch = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);
    const output = await res.json();
    setSearchState([output]);
  };

  return (
    <div>
      <Search
        placeholder="Search Bar"
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            setSearch(value);
          } else {
            setSearchState([]);
          }
          setFilterState("all");
        }}
        onSearch={onSearch}
        enterButton
        className="searchBar"
      />
    </div>
  );
};

export default SearchBar;
