const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

console.log('backend started');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

var users = [];
var confirmados = [];
var manager = []

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
            res.send({
                error: 'Email já cadastrado'
            })
            return;
        }
    }
    console.log(object)
    users.push(object)

    sendConfirmationEmail(object.email, object.nome, object.codigo)

    res.send("User is added to database");
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
    console.log(object)
    const codigo = object.codigo;

    var confirmado = false;

    console.log(codigo)

    for(let i = 0; i < users.length; i++) {
        console.log(users[i].codigo)
        if(users[i].codigo == codigo) {
            confirmado = true;
            const userConfimado = {
                nome: users[i].nome,
                email: users[i].email
            }
            console.log(userConfimado)
            confirmados.push(userConfimado)
            console.log('pushing')
            fs.writeFile('./confirmados.json', JSON.stringify(confirmados), (err) => {
                if (err) throw err;
            });
        }
    }

    if(confirmado) {
        res.send("Usuário confirmado!");
    } else {
        res.send("Código inválido!");
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

var child = 0;
app.post('/manager/dates', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const object = req.body
    console.log(object)
    for(let i = 0; i < manager.dates.length; i++) {
        if((manager.dates[i].date == object.date) && (manager.dates[i].hour == object.hour) && (manager.dates[i].minute === object.minute)) {
            console.log('Data já cadastrada!')
            res.send({
                error: 'Data já cadastrada'
            })
            return;
        }
    }
    manager.dates.push(object)
    
    if(child != 0){
        child.kill()
    }
    child = require('child_process').fork('mailer.js')
    fs.writeFile('./manager.json', JSON.stringify(manager), (err) => {
        if (err) throw err;
    });
    res.send("Dates added to database");
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
        text: `Olá, ${name}, obrigado por se inscrever no evento! Seu código de confirmação é ${codigo}! Entre no link: https://localhost:3333/confirmar`
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