import { Select, ConfigProvider } from 'antd';
import { User } from '../../utils/types';

import './search.css';

const { Option } = Select;

interface SearchProps {
  placeholder: string,
  searchValue: string,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
  userList: User[],
  setUserShowProfile: React.Dispatch<React.SetStateAction<User | null>>,
}

function Search({
  placeholder, searchValue, setSearchValue, userList, setUserShowProfile,
}: SearchProps) {
  const filteredUser = userList.filter((userValue) => (searchValue !== '' && userValue.login.toLowerCase().includes(searchValue.toLowerCase())));

  const handleDropdownChange = (value: string) => {
    const selectedUser = userList.find((user) => user.login === value);

    setSearchValue(value);
    setUserShowProfile(selectedUser || null);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorPrimary: 'var(--color-dark)',
            colorPrimaryHover: 'var(--color-dark-soft)',
            controlOutline: 'var(--color-medium)',
            optionActiveBg: 'var(--color-medium)',
            optionSelectedBg: 'var(--color-medium)',
          },
        },
      }}
    >
      <Select
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
