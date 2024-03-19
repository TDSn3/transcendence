import axios from 'axios';

const checkChannel = async (channelName: string): Promise<boolean> => {
	return ((await axios.get<boolean>(`http://localhost:5001/api/channels/${channelName}/check`)).data);
}

export { checkChannel };
