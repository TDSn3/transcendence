import { UserStatus } from '../../../utils/types';

interface StatusProps {
  userStatus: UserStatus,
}

function Status({ userStatus }: StatusProps) {
  if (userStatus === UserStatus.OFFLINE) {
    return (
      <div className="offline">
        OFFLINE
      </div>
    );
  }

  if (userStatus === UserStatus.ONLINE) {
    return (
      <div className="online">
        ONLINE
      </div>
    );
  }

  if (userStatus === UserStatus.PLAYING) {
    return (
      <div className="playing">
        PLAYING
      </div>
    );
  }
}

export default Status;
