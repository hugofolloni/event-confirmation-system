const nodeSchedule = require('node-schedule');
const nodemailer = require('nodemailer');
require("dotenv").config();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  
const fetchData = () => {
  fetch('http://localhost:3333/manager/dates')
  .then(res => res.json())
  .then(data => {
      for(let i = 0; i < data.length; i++) {
        scheduleTask(data[i].date, data[i].hour, data[i].minute);
      }
    })
}

const scheduleTask = (nextDate, newHour, newMinute) => {
  var date = nextDate.split('-');  
  const dt = new Date(date[0], date[1]-1, date[2], newHour, newMinute);
  console.log(dt)
  const job = nodeSchedule.scheduleJob(dt, () => {
      sendDirectMail()
  });
  console.log(job.nextInvocation());
}

const sendDirectMail = () => {
  fetch('http://localhost:3333/confirmados')
  .then(res => res.json())
  .then(data => {
    for(let i = 0; i < data.length; i++) {
      sendEmail(data[i].email, data[i].nome, 'Lembrete para o evento!');
    }
  })
}

const sendEmail = (email, name, message) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hugofollonidev@gmail.com',
          pass: pass: process.env.PASSWORD
        }
      });
  
      var mailOptions = {
        from: 'hugofollonidev@gmail.com',
        to: email,
        subject: message,
        text: `Olá, ${name}, passando aqui para lembrar do evento DEVSINCRIVEIS que acontecerá dia 24/05!`
      };
  
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent to ' + data.email + ':' + info.response);
        }
      });
}

console.log('running though parent!')
fetchData()