import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, UserGameHistory } from '../../../utils/types';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import gameHistoryService from '../../../services/gameHistory';

import './game-history.css';

interface GameHistoryProps {
  user: User,
}

const defaultUserGameHistory: UserGameHistory = {
  userId: '',
  gameHistory: [],
};

function GameHistory({ user }: GameHistoryProps) {
  const [userGameHistory, setGameHistory] = useState<UserGameHistory>(defaultUserGameHistory);

  gameHistoryService.getUserGameHistory(user.id)
    .then((data) => { setGameHistory(data); });

  return (
    <div className="game-result-container">
      {
        userGameHistory.gameHistory.map((value) => (
          <div key={uuidv4()} className="game-result">
            <div className="game-result-item-start">
              <ProfilePicture size="64px" imageUrl={value.players[0].user.profilePictureUrl} />
              {value.players[0].user.username}
            </div>

            <div className="game-result-item-middle ">
              <span className={`${value.players[0].won ? 'big-number-won' : 'big-number-lose'}  left`}>{value.players[0].score}</span>
              <span className="big-number-won">&nbsp;&nbsp;-&nbsp;&nbsp;</span>
              <span className={`${value.players[1].won ? 'big-number-won' : 'big-number-lose'} right`}>{value.players[1].score}</span>
            </div>

            <div className="game-result-item-end">
              {value.players[1].user.username}
              <ProfilePicture size="64px" imageUrl={value.players[1].user.profilePictureUrl} />
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default GameHistory;
