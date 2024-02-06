import './profile-picture.css';

interface ProfilePictureProps {
	size: string;
	imageUrl: string,
}

const ProfilePicture = ({ size, imageUrl }: ProfilePictureProps) => {
  return (<div className='profile-picture-style' style={{ width: `${size}`, height: `${size}`, backgroundImage: `url(${imageUrl})` }}></div>);
};

export default ProfilePicture;
