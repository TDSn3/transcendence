import { User } from '../../utils/types';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

import './friend-card.css';

interface FriendCardProps {
  user: User,
}

function FriendCard({ user }: FriendCardProps) {
  return (
    <div className="friend-card">
      <ProfilePicture size="128px" imageUrl={user.avatar} />
      {user.login}
    </div>
  );
}

export default FriendCard;
