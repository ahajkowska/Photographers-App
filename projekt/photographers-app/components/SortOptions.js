import React from 'react';

const SortOptions = ({ sortOption, setSortOption }) => {
  return (
    <div className="sort-options">
      <label htmlFor="sort">Sort by:</label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="likes">Likes</option>
        <option value="comments">Comments</option>
        <option value="alphabetical">Alphabetically</option>
      </select>
    </div>
  );
};

export default SortOptions;
