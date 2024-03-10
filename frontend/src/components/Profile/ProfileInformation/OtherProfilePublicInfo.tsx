import { useState, useEffect } from 'react';
import { UserPlus, UserXmark } from 'iconoir-react';
import ButtonRegular from '../../Buttons/ButtonRegular/ButtonRegular';
import ButtonRedHover from '../../Buttons/ButtonRedHover/ButtonRedHover';
import useAuth from '../../../contexts/Auth/useAuth';
import { User } from '../../../utils/types';
import userServices from '../../../services/user';

interface PublicOtherProfileInfoProps {
  isFriend: boolean | undefined,
  setIsFriend: React.Dispatch<React.SetStateAction<boolean | undefined>>,
  userProfile: User,
  handleAddFriendClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
  handleDelFriendClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

function OtherProfilePublicInfo({
  isFriend,
  setIsFriend,
  userProfile,
  handleAddFriendClick,
  handleDelFriendClick,
}: PublicOtherProfileInfoProps) {
  const { user } = useAuth();
  const [userWithFriends, setUserWithFriends] = useState<User>(user);

  const hook = () => {
    userServices
      .getUserById(user.id)
      .then((userValue) => setUserWithFriends(userValue))
      .catch((error) => console.error(error));
  };
  useEffect(hook, [user]);

  const isFriendHook = () => {
    const checkIfFriend = userWithFriends?.friends?.some((friend) => friend.id === userProfile.id);

    if (checkIfFriend) {
      console.error('SO IT\'S POSSIBLE !'); // TODO: investigate this, normally it's ok
    }
    setIsFriend(checkIfFriend || false);
  };
  useEffect(isFriendHook, [userWithFriends?.friends, userProfile, setIsFriend]);

  return (
    <div>
      {
        isFriend ? (
          <ButtonRedHover icon={UserXmark} text="Delete friend" handleClick={handleDelFriendClick} />
        ) : (
          <ButtonRegular icon={UserPlus} text="Add friend" handleClick={handleAddFriendClick} />
        )
      }
    </div>
  );
}

export default OtherProfilePublicInfo;
