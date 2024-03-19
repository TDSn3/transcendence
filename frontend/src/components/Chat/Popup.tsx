/* eslint-disable */

import "./popup.css"

interface PopupProps {
	className: string,
	trigger: any,
	setTrigger: any,
	children: any,
	x: any,
	y: any,
}

function Popup(props: PopupProps) {
	return (props.trigger) ? (
		<div className={props.className + "-popup"} style={{ top: props.y, right: props.x }}>
			<div className={props.className + "-popup-inner"}>
				<button className={props.className + "-close-btn"} onClick={() => props.setTrigger(false)}>X</button>
				{ props.children }
			</div>
		</div>
	) : "";
}

export default Popup;
