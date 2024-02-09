import React, { FormEvent, useState } from 'react';
import "./chat.css";

const InputBar = () => {
	const [bob, setBob] = useState<string>("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement>  = (e: FormEvent) => {
		e.preventDefault();
		setBob("");
	}

	return (
		<form id="form" onSubmit={handleSubmit}>
			<input id="input-chat" type="text" value={bob} autoComplete="off" onChange={(e) => { setBob(e.target.value); }}/>
			<button>Send</button>
		</form>
	);
}

export default InputBar;
