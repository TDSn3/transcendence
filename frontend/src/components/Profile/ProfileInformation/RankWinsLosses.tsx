import { useState, useEffect } from 'react';
import { User } from '../../../utils/types';
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
          <span className="number">{userProfile?.historyGamesWon?.length ?? 0}</span>
        </p>
        <p className="box">
          Losses&nbsp;&nbsp;
          <span className="number">{userProfile?.historyGamesLost?.length ?? 0}</span>
        </p>
      </div>
    </div>
  );
}

export default RankWinsLosses;
