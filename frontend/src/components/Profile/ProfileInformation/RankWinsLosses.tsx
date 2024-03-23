import { User } from '../../../utils/types';

interface RankWinsLossesProps {
  userProfile: User;
}

function RankWinsLosses({ userProfile }: RankWinsLossesProps) {
  return (
    <div className="profile-content">
      <div>
        <p className="box">
          Rank&nbsp;&nbsp;
          <span className="number">NULL</span>
        </p>
      </div>
      <div className="wins-losses">
        <p className="box">
          Wins&nbsp;&nbsp;
          <span className="number">{userProfile.wins}</span>
        </p>
        <p className="box">
          Losses&nbsp;&nbsp;
          <span className="number">{userProfile.losses}</span>
        </p>
      </div>
    </div>
  );
}

export default RankWinsLosses;
