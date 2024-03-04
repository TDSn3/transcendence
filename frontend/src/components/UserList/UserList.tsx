import { v4 as uuidv4 } from 'uuid';
import { User } from '../../utils/types';
import UserListItem from './UserListItem';

interface UserListProps {
  searchValue: string,
  userList: User[],
  setUserShowProfile: React.Dispatch<React.SetStateAction<User | null>>,
}

function UserList({
  searchValue, userList, setUserShowProfile,
}: UserListProps) {
  const filteredUser = userList.filter((userValue) => (searchValue !== '' && userValue.login.toLowerCase().includes(searchValue.toLowerCase())));

  return (
    <>
      {
        filteredUser.map(((userValue) => (
          <UserListItem key={uuidv4()} user={userValue} setUserShowProfile={setUserShowProfile} />
        )))
      }
    </>
  );
}

export default UserList;
