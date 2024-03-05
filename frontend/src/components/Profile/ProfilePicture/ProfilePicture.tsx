import './profile-picture.css';

interface ProfilePictureProps {
  size: string,
  imageUrl: string,
}

function ProfilePicture({ size, imageUrl }: ProfilePictureProps) {
  return (
    <div
      className="profile-picture-style"
      style={{
        width: `${size}`,
        height: `${size}`,
        background: `#000000 url(${imageUrl}) no-repeat center/cover`,
      }}
    />
  );
}

export default ProfilePicture;
