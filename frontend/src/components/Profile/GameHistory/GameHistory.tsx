import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../utils/types';
import useAuth from '../../../contexts/Auth/useAuth';
import ProfilePicture from '../../ProfilePicture/ProfilePicture';
import userServices from '../../../services/user';
import gameHistoryService from '../../../services/gameHistory';

function GameHistory() {
  const { user } = useAuth();
  const [userWithAllData, setUserWithAllData] = useState<User>(user);

  const hook = () => {
    userServices
      .getUserById(user.id)
      .then((userValue) => {
        setUserWithAllData(userValue);
      })
      .catch((error) => { console.error(error); });
  };
  useEffect(hook, [user]);

  return (
    <div className="game-result-container">
      {
        userWithAllData.historyGamesWon.map((value) => (
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
