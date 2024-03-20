import { useNavigate } from 'react-router-dom';
import { Select, ConfigProvider } from 'antd';
import { User } from '../../utils/types';

import './search.css';

const { Option } = Select;

interface SearchProps {
  placeholder: string,
  searchValue: string,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
  userList: User[],
}

function Search({
  placeholder, searchValue, setSearchValue, userList,
}: SearchProps) {
  const navigate = useNavigate();
  const filteredUser = userList.filter((userValue) => (searchValue !== '' && userValue.login.toLowerCase().includes(searchValue.toLowerCase())));

  const handleDropdownChange = (value: string) => {
    const selectedUser = userList.find((user) => user.login === value);

    setSearchValue(value);
    if (selectedUser) {
      navigate(`/profile/${selectedUser.login}`);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorPrimary: 'var(--color-dark-medium)',
            colorPrimaryHover: 'var(--color-medium-dark)',
            controlOutline: 'var(--color-light-medium)',
            optionActiveBg: 'var(--color-light-medium)',
            optionSelectedBg: 'var(--color-light-medium)',
          },
        },
      }}
    >
      <Select
        className="search"
        showSearch
        placeholder={placeholder}
        value={searchValue || undefined}
        onSearch={setSearchValue}
        onChange={handleDropdownChange}
        suffixIcon={null}
        notFoundContent={null}
        defaultActiveFirstOption={false}
        filterOption={false}
      >
        {filteredUser.map((userValue) => (
          <Option key={userValue.id} value={userValue.login}>{userValue.login}</Option>
        ))}
      </Select>
    </ConfigProvider>
  );
}

export default Search;
