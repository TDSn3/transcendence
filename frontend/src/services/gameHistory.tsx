import axios from 'axios';
import { AddGameHistory, InterfaceGameHistory } from '../utils/types';
import errorMessage from '../utils/errorMessage';

const url = `${API_BASE_URL}/game-history`;

const addGameHistory = async (gameResult: AddGameHistory): Promise<InterfaceGameHistory> => {
  try {
    const { data } = await axios.post<InterfaceGameHistory>(`${url}/add`, {
      winningUserId: gameResult.winningUserId,
      winningUserScore: gameResult.winningUserScore,
      losingUserId: gameResult.losingUserId,
      losingUserScore: gameResult.losingUserScore,
    });

    console.log('New game history added.');
    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error POST add game history.'));
  }
};

export default {
  addGameHistory,
};
