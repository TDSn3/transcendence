import './profile-picture.css';

interface ProfilePictureProps {
  size: string,
  imageUrl: string,
  marginBottom?: boolean,
}

function ProfilePicture({ size, imageUrl, marginBottom }: ProfilePictureProps) {
  return (
    <div
      className="profile-picture-style"
      style={{
        width: `${size}`,
        height: `${size}`,
        background: `#000000 url(${imageUrl}) no-repeat center/cover`,
        marginBottom: `${marginBottom ? '16px' : '0px'}`,
      }}
    />
  );
}

ProfilePicture.defaultProps = {
  marginBottom: false,
};

export default ProfilePicture;
