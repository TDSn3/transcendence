import { Link } from 'react-router-dom';
import { User } from '../../utils/types';
import './user-list-item.css';

interface UserListItemProps {
  user: User,
}

function UserListItem({ user }: UserListItemProps) {
  return (
    <Link to={`/profile/${user.login}`}>
      <div className="user-list-item">
        {user.login}
      </div>
    </Link>
  );
}

export default UserListItem;
