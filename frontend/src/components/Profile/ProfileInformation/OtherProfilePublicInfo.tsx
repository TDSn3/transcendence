import { useState, useEffect } from 'react';
import { UserPlus, UserXmark, Prohibition, MessageText } from 'iconoir-react';
import ButtonRegular from '../../Buttons/ButtonRegular/ButtonRegular';
import ButtonRedHover from '../../Buttons/ButtonRedHover/ButtonRedHover';
import useAuth from '../../../contexts/Auth/useAuth';
import { User } from '../../../utils/types';
import userServices from '../../../services/user';

interface PublicOtherProfileInfoProps {
  isFriend: boolean | undefined;
  setIsFriend: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isBlocked: boolean | undefined;
  setIsBlocked: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  userProfile: User;
  handleAddFriendClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleDelFriendClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleAddBlockClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleDelBlockClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleDirectMessages: () => Promise<void>;
}

function OtherProfilePublicInfo({
  isFriend,
  setIsFriend,
  isBlocked,
  setIsBlocked,
  userProfile,
  handleAddFriendClick,
  handleDelFriendClick,
  handleAddBlockClick,
  handleDelBlockClick,
  handleDirectMessages,
}: PublicOtherProfileInfoProps) {
  const { user } = useAuth();
  const [userWithFriends, setUserWithFriends] = useState<User>(user);
  const [userWithBlocked, setUserWithBlocked] = useState<User>(user);

  const hook = () => {
    if (!user || !user.id) {
      console.error('Auth context hook not yet !');
      return;
    }

    userServices
      .getUserById(user.id)
      .then((userValue) => setUserWithFriends(userValue))
      .catch((error) => console.error(error));
    userServices
      .getUserById(user.id)
      .then((userValue) => setUserWithBlocked(userValue))
      .catch((error) => console.error(error));
  };
  useEffect(hook, [user, user.id]);

  const isFriendHook = () => {
    const checkIfFriend = userWithFriends?.friends?.some(
      (friend) => friend.id === userProfile.id,
    );

    setIsFriend(checkIfFriend || false);
  };
  useEffect(isFriendHook, [userWithFriends?.friends, userProfile, setIsFriend]);

  const isBlockedHook = () => {
    const checkIfBlock = userWithBlocked?.blocked?.some(
      (blocked) => blocked.id === userProfile.id,
    );

    setIsBlocked(checkIfBlock || false);
  };
  useEffect(isBlockedHook, [
    userWithBlocked?.blocked,
    userProfile,
    setIsBlocked,
  ]);

  return (
    <div>
      {isFriend ? (
        <ButtonRedHover
          icon={UserXmark}
          text="Delete friend"
          handleClick={handleDelFriendClick}
        />
      ) : (
        <ButtonRegular
          icon={UserPlus}
          text="Add friend"
          handleClick={handleAddFriendClick}
        />
      )}
      <ButtonRegular
        icon={MessageText}
        text="Direct messages"
        handleClick={handleDirectMessages}
      />
      {isBlocked ? (
        <ButtonRegular
          icon={Prohibition}
          text="Unblock"
          handleClick={handleDelBlockClick}
        />
      ) : (
        <ButtonRedHover
          icon={Prohibition}
          text="Block"
          handleClick={handleAddBlockClick}
        />
      )}
    </div>
  );
}

export default OtherProfilePublicInfo;
