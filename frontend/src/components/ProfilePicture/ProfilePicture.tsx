import './profile-picture.css';

interface ProfilePictureProps {
  size: string,
  imageUrl: string,
  margin?: string,
  marginBottom?: boolean,
}

function ProfilePicture({
  size,
  imageUrl,
  margin,
  marginBottom,
}: ProfilePictureProps) {
  const styleWithoutMargin = {
    width: `${size}`,
    height: `${size}`,
    background: `#000000 url(${imageUrl}) no-repeat center/cover`,
    marginBottom: `${marginBottom ? '16px' : '0px'}`,
  };

  const styleWithMargin = {
    width: `${size}`,
    height: `${size}`,
    background: `#000000 url(${imageUrl}) no-repeat center/cover`,
    marginBottom: `${marginBottom ? '16px' : '0px'}`,
    margin: `${margin}`,
  };

  return (
    <div
      className="profile-picture-style"
      style={margin ? styleWithMargin : styleWithoutMargin}
    />
  );
}

ProfilePicture.defaultProps = {
  marginBottom: false,
  margin: null,
};

export default ProfilePicture;
