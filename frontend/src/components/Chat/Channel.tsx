import './channel.css';

interface ChannelProps {
  name: string,
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>,
}

function Channel({
  name,
  setIsModalVisible,
  setSelectedChannel,
}: ChannelProps) {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsModalVisible(true);
    setSelectedChannel(name);
  };

  return (
    <button className="channel" type="button" value={name} onClick={handleClick}>
      {name}
    </button>
  );
}

export default Channel;
