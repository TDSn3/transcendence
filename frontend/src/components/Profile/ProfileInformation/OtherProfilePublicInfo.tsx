import { useState, useEffect } from 'react';
import { UserPlus, UserXmark } from 'iconoir-react';
import ButtonRegular from '../../Buttons/ButtonRegular/ButtonRegular';
import ButtonRedHover from '../../Buttons/ButtonRedHover/ButtonRedHover';
import useAuth from '../../../contexts/Auth/useAuth';
import { User } from '../../../utils/types';
import userServices from '../../../services/user';

// test
import gameHistoryServices from '../../../services/gameHistory';

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

    setIsFriend(checkIfFriend || false);
  };
  useEffect(isFriendHook, [userWithFriends?.friends, userProfile, setIsFriend]);

  const handler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    gameHistoryServices
      .addGameHistory({
        winningUserId: '58206f2c-eb8f-4af4-8d80-0cb63e94acff',
        winningUserScore: 5,
        losingUserId: 'b8df40c6-7aed-4596-b963-f6165855658b',
        losingUserScore: 3,
      });
  };

  return (
    <div>
      {
        isFriend ? (
          <ButtonRedHover icon={UserXmark} text="Delete friend" handleClick={handleDelFriendClick} />
        ) : (
          <ButtonRegular icon={UserPlus} text="Add friend" handleClick={handleAddFriendClick} />
        )
      }
      {
        isFriend && (<ButtonRegular icon={UserPlus} text="TEST" handleClick={handler} />)
      }
    </div>
  );
}

export default OtherProfilePublicInfo;
