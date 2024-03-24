import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ChannelProps {
  name: string,
  intraId: number,
}

function Channel({ name, intraId }: ChannelProps) {
  const navigate = useNavigate();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    await axios.post('http://localhost:5001/api/channelMembers', { intraId, channelName: name });

    navigate(`/chat/${name}`);
  };

  return (
    <button type="button" value={name} onClick={handleClick}>
      {name}
    </button>
  );
}

export default Channel;
