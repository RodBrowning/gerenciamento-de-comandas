const nodemailer = require('nodemailer');

const Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rodrigo.lojaonline@gmail.com',
    pass: 'Rod$753658'
  }
});


module.exports = {Transporter}