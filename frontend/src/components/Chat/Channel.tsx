import { useNavigate } from 'react-router-dom';

interface ChannelProps {
  name: string,
}

function Channel({ name }: ChannelProps) {
  const navigate = useNavigate();

  const handleClick: any = () => {
    navigate(`/chat/${name}`);
  };

  return (
    <div className="channel">
      <input type="button" value={name} onClick={handleClick} />
    </div>
  );
}

export default Channel;
