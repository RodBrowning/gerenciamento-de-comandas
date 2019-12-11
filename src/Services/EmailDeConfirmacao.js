const jwt = require('jsonwebtoken')

module.exports = {
    enviarEmailDeConfirmacao(id_usuario, email){
        let emailToken = jwt.sign({user: id_usuario},email,{expiresIn: "1d"}),
            url = `http://localhost:2000/validacaoDeUsuario/${email}/${emailToken}`,
            mailOptions = {
                from: 'rodrigo.lojaonline111@gmaill.com',
                to: email,
                subject: 'Confirm Email',
                html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
            },
            { Transporter } = require('./CredenciaisDeEmail')
        
        Transporter.sendMail(mailOptions,function(error, info){
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)                
            }
        })
        return emailToken
    }
}