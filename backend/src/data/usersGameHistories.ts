import { UserGameHistory } from '../utils/types';

const usersGameHistories: UserGameHistory[] = [
  {
    userId: 'd2773336-f723-11e9-8f0b-362b9e155667',
    gameHistory: [
      {
        players: [
          {
            user: {
              id: 'd2773336-f723-11e9-8f0b-362b9e155667',
              username: 'tda-silv',
              profilePictureUrl:
                'https://avatars.githubusercontent.com/u/92325211?v=4',
            },
            score: 10,
            won: true,
          },
          {
            user: {
              id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
              username: 'Boby-Booba',
              profilePictureUrl:
                'https://avatars.githubusercontent.com/u/86242235?v=4',
            },
            score: 3,
            won: false,
          },
        ],
      },
    ],
  },
  {
    userId: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
    gameHistory: [
      {
        players: [
          {
            user: {
              id: 'd2773336-f723-11e9-8f0b-362b9e155667',
              username: 'tda-silv',
              profilePictureUrl:
                'https://avatars.githubusercontent.com/u/92325211?v=4',
            },
            score: 10,
            won: true,
          },
          {
            user: {
              id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
              username: 'Boby-Booba',
              profilePictureUrl:
                'https://avatars.githubusercontent.com/u/86242235?v=4',
            },
            score: 3,
            won: false,
          },
        ],
      },
    ],
  },
];

export default usersGameHistories;
