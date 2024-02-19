import React, { FormEvent, useState } from 'react';
import "./chat.css";

const InputBar = () => {
	const [bob, setBob] = useState<string>("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement>  = (e: FormEvent) => {
		e.preventDefault();
		setBob("");
	}

	return (
		<form className="input-bar" onSubmit={handleSubmit}>
			<input className="input-text" type="text" value={bob} autoComplete="off" onChange={(e) => { setBob(e.target.value); }}/>
			<button className="input-button">Send</button>
		</form>
	);
}

export default InputBar;
