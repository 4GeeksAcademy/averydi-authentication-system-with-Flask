import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Login = () => {
	const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const token = sessionStorage.getItem("token");

    const handleClick = () => {
        const opts = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
        fetch("https://3000-4geeksacade-averydiauth-ov22jhlq6xe.ws-us98.gitpod.io/api/token", opts)
            .then(resp => {
                if (resp.status === 200) return resp.json();
                else alert("Holy smokes there's an error!");
            })
            .then(data => {
                console.log("This came from the backend", data);
                sessionStorage.setItem("token", data.access_token);
            })
            .catch(error => {
                console.error("Holy smokes there's an error!", error);
            });
    }

	return (
		<div className="text-center mt-5">
			<h1>Login</h1>
            {token && token!="" && token!=undefined ? ("You are logged in with this token" + token) : (
                <div>
                    <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleClick}>Login</button>
                </div>
            )}
		</div>
	);
};
