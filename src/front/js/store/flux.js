const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},


			syncTokenFromSessionStore: () => {
				const token = sessionStorage.getItem("token")
				console.log("Application just loaded, syncing the session storage token.")
				if (token && token!="" && token!=undefined) setStore({token: token})
			},

			userLogin: async (email,password)=>{
				const resp = await getActions().apiFetch("/login", "POST", {email,password})
				console.log({email,password})
				if (resp.code >= 400) {
					return resp
				}
				setStore({accessToken:resp.data.accessToken})
				localStorage.setItem("accessToken", resp.data.accessToken)
				return resp
			},
			loadToken(){
				let token = localStorage.getItem("accessToken")
				setStore({accessToken:token})
			},

			logout: () => {
				sessionStorage.removeItem("token")
				console.log("Logging out")
				setStore({token: null})
			},


			getMessage: async () => {
				try{
					const store = getStore();
					const opts = {
						headers: {
							"Authorization": "Bearer " + store.token
						}
					}
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				const store = getStore();

				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				setStore({ demo: demo });
			}
		}
	};
};

export default getState;