import './search.css';

interface SearchProps {
  placeholder: string,
  searchValue: string,
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

function Search({ placeholder, searchValue, handleSearchChange }: SearchProps) {
  return (
    <input
      className="search"
      placeholder={placeholder}
      value={searchValue}
      onChange={handleSearchChange}
    />
  );
}

export default Search;
