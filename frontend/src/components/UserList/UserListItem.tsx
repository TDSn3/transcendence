import { Link } from 'react-router-dom';
import { User } from '../../utils/types';
import './user-list-item.css';

interface UserListItemProps {
  user: User,
  setUserShowProfile: React.Dispatch<React.SetStateAction<User | null>>,
}

function UserListItem({ user, setUserShowProfile }: UserListItemProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();

    setUserShowProfile(user);
  };

  return (
    <Link to={`/profile/${user.login}`} onClick={handleClick}>
      <div className="user-list-item">
        {user.login}
      </div>
    </Link>
  );
}

export default UserListItem;
