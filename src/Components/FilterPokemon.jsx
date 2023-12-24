import React, { useState } from "react";
import { Select } from "antd";

const FilterPokemon = (props) => {
  const {
    data: { setFilterState = () => {}, filterState = "all", types = [] } = {},
  } = props || [];

  const [selectedOption, setSelectedOption] = useState(filterState);

  return (
    <div>
      <Select
        className="filter"
        style={{ width: 200 }}
        placeholder="Select a type"
        options={types}
        onChange={(value) => {
          setSelectedOption(value);
          setFilterState(value);
        }}
        value={selectedOption}
      />
    </div>
  );
};

export default FilterPokemon;
