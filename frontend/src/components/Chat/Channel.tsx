import { useNavigate } from 'react-router-dom';

interface ChannelProps {
  name: string,
}

function Channel({ name }: ChannelProps) {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    navigate(`/chat/${name}`);
  };

  return (
    <button type="button" value={name} onClick={handleClick}>
      {name}
    </button>
  );
}

export default Channel;
