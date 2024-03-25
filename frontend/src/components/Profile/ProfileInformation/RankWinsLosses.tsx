import { useState, useEffect } from 'react';
import { User, InterfaceGameHistory } from '../../../utils/types';
import userServices from '../../../services/user';

interface RankWinsLossesProps {
  userProfile: User,
}

function RankWinsLosses({ userProfile }: RankWinsLossesProps) {
  const [rank, setRank] = useState<number>(0);

  const hook = () => {
    if (!userProfile || !userProfile.id) {
      console.error('Auth context hook not yet !');
      return;
    }

    userServices
      .getRank(userProfile.id)
      .then((value) => setRank(value.rank))
      .catch((error) => console.error(error));
  };
  useEffect(hook, [userProfile, userProfile.id]);

  // eslint-disable-next-line max-len
  const Wins = userProfile?.historyGamesWon?.reduce((accumulator, currentValue: InterfaceGameHistory) => {
    if (currentValue.WinningUserScore === currentValue.LosingUserScore) return (accumulator);
    return (accumulator + 1);
  }, 0);

  // eslint-disable-next-line max-len
  const Losses = userProfile?.historyGamesLost?.reduce((accumulator, currentValue: InterfaceGameHistory) => {
    if (currentValue.WinningUserScore === currentValue.LosingUserScore) return (accumulator);
    return (accumulator + 1);
  }, 0);

  return (
    <div className="profile-content">
      <div>
        <p className="box">
          Rank&nbsp;&nbsp;
          <span className="number">{rank}</span>
        </p>
      </div>
      <div className="wins-losses">
        <p className="box">
          Wins&nbsp;&nbsp;
          <span className="number">{Wins}</span>
        </p>
        <p className="box">
          Losses&nbsp;&nbsp;
          <span className="number">{Losses}</span>
        </p>
      </div>
    </div>
  );
}

export default RankWinsLosses;
