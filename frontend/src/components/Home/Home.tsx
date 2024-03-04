import { useState } from 'react';
import Search from '../Search/Search';

function Home() {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setSearchValue(event.target.value);

  return (
    <div className="page">
      <h3>Home</h3>
      <Search
        placeholder="Search"
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
      />
    </div>
  );
}

export default Home;
