import chatting from "./assets/undraw_creative_thinking_re_9k71.svg"
const Home = () => {

    return ( 
        <div className="homepage">
            <div className="purple-background">
                <header>
                    <h1 className='title'>ECS</h1>
                    <h4>Your event confirmation system.</h4>
                </header>
                <a className='go-manager' href="authenticate">Go to Dashboards</a>
            </div>
            <img src={chatting} className='homepage-image' width='100px' alt=''/>
            <div className="explicacao">
                <h4>O que somos?</h4>
                <p>Somos uma plataforma para gerenciamento de eventos. Aqui, você pode criar seu evento, enviar o formulário de inscrição e nós cuidados dos emails automáticos de confirmação e lembrete. Nos dashboards, configure as datas e veja seus participantes.</p>
            </div>
        </div>
     );
}
 
export default Home;