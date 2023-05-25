import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Login = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<input type="text" placeholder="email"></input>
			<input type="password" placeholder="password"></input>
			<button class = "btn btn-secondary mr-4">Submit</button>
			<div className="alert alert-info">
				{store.message || "Loading from Backend..."}
			</div>
		</div>
	);
};