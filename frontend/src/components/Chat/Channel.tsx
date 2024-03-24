import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ChannelProps {
  name: string,
  intraId: number
}

function Channel({ name, intraId }: ChannelProps) {
  const navigate = useNavigate();

  const handleClick: any = async () => {
	await axios.post("http://localhost:5001/api/channelMembers", { intraId: intraId, channelName: name })
    navigate(`/chat/${name}`);
  };

  return (
    <div className="channel">
      <input type="button" value={name} onClick={handleClick} />
    </div>
  );
}

export default Channel;
