import { useState } from "react";

const Manager = () => {

    const autenticado = window.localStorage.getItem("manager");

    const handleSignOut = () => {
        window.localStorage.removeItem("manager");
        window.location.href = "http://localhost:3000/";
    }

    const [convidados, setConvidados] = useState([]);
    const [confirmados, setConfirmados] = useState([]);
    const [date, setDate] = useState([]);

    const fetchData = (url, action) => {
        console.log('fetching')
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if(action === 'convidados') {
                setConvidados(data);
                console.log(data)
            } else if(action ==="confirmados") {
                setConfirmados(data);
            } else if(action === "date"){
                setDate(data);
                console.log(data)
            }

        })
    }

    const [showAddData, setShowAddData] = useState(false);

    const handleShowAddData = () => {
        setShowAddData(!showAddData);
    }

    const [newDate, setNewDate] = useState("");
    const [newHour, setNewHour] = useState(0);
    const [newMinutes, setNewMinutes] = useState(0);

    const handleAddData = () => {
        fetch('http://localhost:3333/manager/dates', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: newDate,
                    hour: newHour,
                    minute: newMinutes
                    })
            })
        .then(() => {
            fetchData('http://localhost:3333/manager/dates', 'date')
        })
    }


    return ( 
        <div>
            <div className="purple-background">
            <header>
                <h1 className='dashboard-title'>Manager Dashboard</h1>
            </header>
            <button className='go-manager' onClick={() => handleSignOut()}>Sign Out</button>
            </div>
            { autenticado && (
                <div>
                    <div className="dashboards">
                        <div className="single-dashboard">
                            <div className="header-dashboard">
                                <h1>Convidados</h1>
                                <button onClick={() => fetchData("http://localhost:3333/usuario", 'convidados')}>Get</button>
                            </div>
                            <div className="items">
                                {convidados.map(convidado => {
                                    return (
                                        <div>
                                            <p>{convidado.nome}</p>
                                            <p>{convidado.email}</p>
                                        </div>
                                    )})
                                }       
                                
                            </div>
                        </div>
                        <div className="single-dashboard">
                            <div className="header-dashboard">
                                <h1>Confirmados</h1>
                                <button onClick={() => fetchData("http://localhost:3333/confirmados", 'confirmados')}>Get</button>
                            </div>
                            <div className="items">
                                {confirmados.map(confirmado => {
                                    return (
                                        <div>
                                            <p>{confirmado.nome}</p>
                                            <p>{confirmado.email}</p>
                                        </div>
                                    )})
                                }
                            </div>
                        </div>
                    </div>
                    <div className="datas">
                        <div className="header-dashboard">
                            <h1>Lembretes</h1>
                            <button onClick={() => fetchData("http://localhost:3333/manager/dates", 'date')}>Get</button>

                        </div>
                        <div className="data-items">
                            { date.map(data => {
                                return (
                                    <div>
                                        <p>· {data.date}</p>
                                    </div>
                            )})}
                        </div>
                        <button class="add-data-button" onClick={() => handleShowAddData()}>+</button>
                        { showAddData && (
                            <div>
                                <div className='fake-background'></div>
                                <div className='show-datas-div'>
                                    <h3>Adicionar data</h3>
                                    <p className='close-button' onClick={() => setShowAddData(false)}>X</p>
                                    <div className='add-data-first-row'>
                                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}/>
                                    </div>
                                    <div className='add-data-second-row'>
                                        <input type='number' step='1' max='23' value={newHour} onChange={(e) => setNewHour(e.target.value)}/>
                                        <input type='number' step='1' max='59' value={newMinutes} onChange={(e) => setNewMinutes(e.target.value)}/>
                                    </div>
                                    <button onClick={() => handleAddData()}>Adicionar</button>
                                </div>
                            </div>)}
                    </div>
                    
                </div>
            )
        }
    </div>
     );
}
 
export default Manager;