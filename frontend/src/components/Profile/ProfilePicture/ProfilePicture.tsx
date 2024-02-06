import './profile-picture.css';

interface ProfilePictureProps {
	imageUrl: string,
}

const ProfilePicture = ({ imageUrl }: ProfilePictureProps) => {
  return (<div className='profile-picture-style' style={{ backgroundImage: `url(${imageUrl})` }}></div>);
};

export default ProfilePicture;
