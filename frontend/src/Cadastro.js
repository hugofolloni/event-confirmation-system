import { useState } from "react";
import exams from "./assets/undraw_exams_re_4ios.svg"


const Cadastro = () => {

    const letterArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = () => {
        const sendName = nome;
        const sendEmail = email;
        
        var codigo = ""
        for (let i = 0; i < 6; i++) {
            codigo += letterArray[Math.floor(Math.random() * 26)];
        }

        const data = { 
            nome: sendName.toUpperCase(),
            email: sendEmail,
            codigo: codigo
        }

        fetch("http://localhost:3333/usuario", {
            method: "POST",
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if(res.message === "Email is already on database"){
                alert("O email já está cadastrado")
            }else{
                window.location.href = "/thanks"
            }
        })
    }

    return ( 
        <div className="cadastro">
            <div className="purple-background">
                <header>
                    <h1 className='title'>ECS</h1>
                    <h4>Your event confirmation system.</h4>
                </header>
            </div>
            <div className="container">
                <h1 className='form-title-inscreva-se'>Inscreva-se</h1>
                <div className="form">
                    <div className="form-item">
                        <p>Nome</p>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="form-item">
                        <p>Email</p>
                         <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="botao">
                    <button onClick={() => handleSubmit() }>Confirmar</button>
                </div>
            </div>
            <img src={exams} className='cadastro-image' width='100px' alt=''/>
        </div>
     );
}
 
export default Cadastro;