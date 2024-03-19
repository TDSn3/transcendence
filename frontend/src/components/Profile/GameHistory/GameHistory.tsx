import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, InterfaceGameHistory } from '../../../utils/types';
import ProfilePicture from '../../ProfilePicture/ProfilePicture';
import userServices from '../../../services/user';

interface GameHistoryProps {
  userProfile: User,
}

function GameHistory({ userProfile }: GameHistoryProps) {
  const [userWithAllData, setUserWithAllData] = useState<User>(userProfile);
  const [gameHistory, setGameHistory] = useState<InterfaceGameHistory[]>([]);

  const hookSetUserWithAllData = () => {
    if (userProfile?.id) {
      userServices
        .getUserById(userProfile.id)
        .then((userValue) => { setUserWithAllData(userValue); })
        .catch((error) => { console.error(error); });
    }
  };
  useEffect(hookSetUserWithAllData, [userProfile]);

  const hookSetGameHistory = () => {
    if (userProfile?.id) {
      const historyGamesWon = userWithAllData.historyGamesWon.map((value) => value);
      const historyGamesLost = userWithAllData.historyGamesLost.map((value) => value);
      const historyGames = [...historyGamesWon, ...historyGamesLost]
        .sort((a, b) => {
          const dateA = new Date(a.playedAt);
          const dateB = new Date(b.playedAt);

          return (dateB.getTime() - dateA.getTime());
        });

      setGameHistory(historyGames.map((value) => value));
    }
  };
  useEffect(
    hookSetGameHistory,
    [userProfile, userWithAllData.historyGamesLost, userWithAllData.historyGamesWon],
  );

  return (
    <div className="game-result-container">
      {
        gameHistory?.map((value) => (
          <div key={uuidv4()} className="game-result">
            <div className="game-result-item-start">
              <ProfilePicture size="64px" imageUrl={value.WinningUser.avatar} marginBottom />
              {value.WinningUser.login}
            </div>

            <div className="game-result-item-middle ">
              <span className="big-number-won">{value.WinningUserScore}</span>
              <span className="big-number-won">&nbsp;&nbsp;-&nbsp;&nbsp;</span>
              <span className="big-number-lose">{value.LosingUserScore}</span>
            </div>

            <div className="game-result-item-end">
              {value.LosingUser.login}
              <ProfilePicture size="64px" imageUrl={value.LosingUser.avatar} marginBottom />
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default GameHistory;
