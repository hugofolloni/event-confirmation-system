const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

// server/index.js
const path = require('path');
const express = require('express');


// Fazer com que o Node sirva os arquivos do app em React criado
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Lidar com as solicitações GET feitas à rota /api
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Todas as outras solicitações GET não tratadas retornarão nosso app em React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

console.log('Backend is running!');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

var users = [];
var confirmados = [];
var manager = []

var child = 0;

fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    users = JSON.parse(data);
});

fs.readFile('./confirmados.json', 'utf8', (err, data) => {
    if (err) throw err;
    confirmados = JSON.parse(data);
});

fs.readFile('./manager.json', 'utf8', (err, data) => {
    if (err) throw err;
    manager = JSON.parse(data);
});

app.post('/usuario', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const object = req.body
    for(let i = 0; i < users.length; i++) {
        if(users[i].email === object.email) {
            return res.send({
                message: 'Email is already on database'
            })
        }
    }
    console.log(`Pushing user to database`)
    users.push(object)

    sendConfirmationEmail(object.email, object.nome, object.codigo)

    res.send({message: "User is added to database"});
    fs.writeFile('./data.json', JSON.stringify(users), (err) => {
        if (err) throw err;
    });
})

app.get('/usuario', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(users)
})

app.get('/usuario/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const id = req.params.id;
    res.json(users[id])
})

app.post('/confirmados', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const object = req.body
    const codigo = object.codigo;

    var confirmado = false;

    for(let i = 0; i < confirmados.length; i++) {
        if(confirmados[i].codigo == codigo) {
            confirmado = false;
            return res.send({
                message: 'Codigo is already on database'
            })
        }
    }

    for(let i = 0; i < users.length; i++) {
        if(users[i].codigo == codigo) {
            confirmado = true;
            const userConfimado = {
                nome: users[i].nome,
                email: users[i].email,
                codigo: users[i].codigo
            }
            confirmados.push(userConfimado)
            console.log(`Pushing user to database`)
            res.send({message: "User is added to database"});
            fs.writeFile('./confirmados.json', JSON.stringify(confirmados), (err) => {
                if (err) throw err;
            });
        }
    }

    console.log(confirmado)

    if(!confirmado) {
        res.send({
            message: 'Codigo is not on database'
        })
    }
    else{
        if(child != 0){
            child.kill()
        }
        child = require('child_process').fork('mailer.js')
    }

})

app.get('/confirmados', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(confirmados)
})

app.get('/confirmados/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const id = req.params.id;
    res.json(confirmados[id])
})

app.get('/manager', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(manager)
})

app.get('/manager/dates', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(manager.dates)
})

app.post('/manager/dates', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const object = req.body
    console.log(object)
    for(let i = 0; i < manager.dates.length; i++) {
        if((manager.dates[i].date == object.date) && (manager.dates[i].hour == object.hour) && (manager.dates[i].minute === object.minute)) {
            return res.send({
                message: 'Date is already on database'
            })
        }
    }
    manager.dates.push(object)
    res.send({message: "Date is added to database"});
    console.log(`Pushing date to database`)
    
    if(child != 0){
        child.kill()
    }
    child = require('child_process').fork('mailer.js')
    fs.writeFile('./manager.json', JSON.stringify(manager), (err) => {
        if (err) throw err;
    });
})


const sendConfirmationEmail = (email, name, codigo) => {
    const nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hugofollonidev@gmail.com',
          pass: process.env.PASSWORD
        }
    });
  
    var mailOptions = {
        from: 'hugofollonidev@gmail.com',
        to: email,
        subject: "Obrigado pela inscrição em DEVSINCRIVEIS",
        text: `Olá, ${name}, obrigado por se inscrever no evento! Seu código de confirmação é ${codigo}! Entre no link: https://localhost:3000/confirmar`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent to ' + data.email + ':' + info.response);
        }
    });
}



app.listen(3333);