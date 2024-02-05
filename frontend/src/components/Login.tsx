// TODO
const redirect_url = process.env.REACT_APP_42API as string;

const Login = () => {
	const handleSignupClick = async () => {
		try {
			// make a redirection with 42 api on env file
			window.location.href = redirect_url;

		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
		  <button onClick={handleSignupClick}>Signin42</button>
		</>
	);
}

export default Login
