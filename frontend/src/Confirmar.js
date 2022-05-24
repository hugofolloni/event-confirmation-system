import { useState } from 'react';
import job from "./assets/undraw_job_offers_re_634p.svg"


const Confirmar = () => {

    const [codigo, setCodigo] = useState("");

    const handleSubmit = () => {
        const sendCodigo = codigo;

        fetch("http://localhost:3333/confirmados", {
            method: "POST",
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({codigo: sendCodigo})
        })
        .then(res => res.json())
        .then(res=>{
                console.log(res)
                if(res.message === "Codigo is already on database"){
                    alert("O código já está confirmado!")
                }else if(res.message === "Codigo is not on database"){
                    alert("O código não é válido!")
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
                <h1 className='form-title-confirmar'>Confirmar </h1>
                <div className="form">
                    <div className="form-item">
                        <p>Código</p>
                        <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                    </div>
                </div>
                <div className="botao">
                    <button onClick={() => handleSubmit()}>Confirmar</button>
                </div>
            </div>
            <img src={job} className='cadastro-image' width='100px' alt=''/>
        </div>
     );
}
 
export default Confirmar;