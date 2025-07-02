import { useState } from 'react';

const ListingFilters = ({ onFilter, cities }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      minPrice,
      maxPrice,
      city: selectedCity
    });
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedCity('');
    onFilter({});
  };

  return (
    <form onSubmit={handleSubmit} className="filters-form row">
        <div className='row'>   
            
      <div className="filter-group">
        <label>Цена:</label>
        <div className="price-range">
          <input
            type="number"
            placeholder="От"
            value={minPrice}
            min="0"
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="До"
            value={maxPrice}
            min="0"
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Город:</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Все города</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      </div>

      <div className="row">
        <button type="submit" className='white-btn blue-btn'>Применить</button>
        <button type="button" className='white-btn red-btn' onClick={handleReset}>Сбросить</button>
      </div>
    </form>
  );
};

export default ListingFilters;