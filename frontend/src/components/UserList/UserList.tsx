import { v4 as uuidv4 } from 'uuid';
import { User } from '../../utils/types';
import UserListItem from './UserListItem';

interface UserListProps {
  searchValue: string,
  userList: User[],
}

function UserList({ searchValue, userList }: UserListProps) {
  const filteredUser = userList.filter((userValue) => (searchValue !== '' && userValue.login.toLowerCase().includes(searchValue.toLowerCase())));

  return (
    <>
      {
        filteredUser.map(((userValue) => (<UserListItem key={uuidv4()} user={userValue} />)))
      }
    </>
  );
}

export default UserList;
