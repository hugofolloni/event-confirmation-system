import { useState } from "react";

const Authenticate = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        var liberado = false;

        fetch("http://localhost:3333/manager")
        .then(res => res.json())
        .then(data => {
            for(let i = 0; i < data.accounts.length; i++) {
                console.log(data.accounts[i])
                console.log(username, password)
                console.log(data.accounts[i].username === username)
                console.log(data.accounts[i].username, username.length)
                console.log(data.accounts[i].password === password)
                if(data.accounts[i].username === username && data.accounts[i].password === password) {
                    liberado = true;
                    console.log('liberado')
                }
            }
            if(liberado) {
                window.location.href = "http://localhost:3000/manager";
                window.localStorage.setItem("manager", "true");
            } else {
                alert("Usuário ou senha incorretos");
            }
        })

    }

    return ( 
        <div className='autenticar'>
            <div className="container">
                <h1 className='form-title-authenticate'>Login</h1>
                <div className="form">
                    <p>User</p>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p>Password</p>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="botao">
                    <button onClick = {() => handleSubmit()}>Confirmar</button>
                </div>
            </div>

        </div>
     );
}
 
export default Authenticate;