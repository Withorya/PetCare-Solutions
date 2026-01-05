const express = require('express');
const router = express.Router();
const db = require('../db');
const multer  = require('multer');
const nodemailer = require('nodemailer');
const API_URL_DOMAIN = "https://api-rest-comedouro-2poss.onrender.com/"
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 2525,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'apikey', 
        pass: process.env.SENDGRID_API_KEY, 
    },
    connectionTimeout: 5000, 
    socketTimeout: 5000      
});



const rec = {}

const del = {}

const upload = multer({ storage: multer.memoryStorage() });

router.post('/cadastro', (req, res) =>{
    const { Nome, Email, Senha, Data_nascimento} = req.body
    if ( !Nome || !Email || !Senha || !Data_nascimento) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        const queryCheck = 'SELECT * FROM usuario WHERE Email = ?';

        

        connection.query(queryCheck, [Email], (err, results) => {
            if (err) {
                connection.release();
                console.error('Erro ao verificar email:', err);
                return res.status(500).json({ error: 'Erro ao verificar email.' });
            }
            if (results.length > 0) {
                connection.release();
                return res.status(409).json({ error: 'Email já cadastrado.' });
            }

            const insertUsuario = `
                INSERT INTO usuario ( Nome, Email, Senha, Data_Nascimento , Foto)
                VALUES ( ?, ?, ?, ?, "")
            `;

            connection.query(insertUsuario, [ Nome, Email, Senha, Data_nascimento], (err, result) => {
                connection.release();

                if (err) {
                    console.error('Erro ao inserir usuário:', err);
                    return res.status(500).json({ error: 'Erro ao inserir usuário.' });
                }
                const criacao = {
                    from: 'asparagussolutions@gmail.com', // Sender address
                    to: Email, 
                    subject: 'Verificação de Email', // Subject line
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #F2C438;">Bem<span style="color: #805BEF;">-vindo, ${Nome}!</span></h2>
                            <p>Obrigado por se cadastrar. Para garantir a segurança da sua conta, clique no botão abaixo:</p>
                            <br>
                            <a href="https://api-rest-comedouro-2poss.onrender.com/usuario/verificar-usuario?email=${Email}" 
                                style="background-color: #805BEF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Confirmar Meu Email
                            </a>
                            <br><br>
                            <p style="color: #000000ff; font-size: 12px;">Se você não criou esta conta, ignore este email.</p>
                        </div>
                        `
                }
                transporter.sendMail(criacao, (error, info) => {
                    if (error) {
                        console.error('Erro no envio (SendGrid):', error);
                    } else {
                        console.log('Email enviado com sucesso:', info.response);
                    }
                });
                res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id_usuario: result.insertId });
            });
        });
    });
})

router.get('/login', (req, res) => {
    const { Email, Senha } = req.query;

    if (!Email || !Senha) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }

    const query = `
        SELECT * FROM usuario
        WHERE Email = ? AND Senha = ? AND confirma = true
    `;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(query, [Email, Senha], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erro ao buscar usuário:', err);
                return res.status(500).json({ error: 'Erro ao buscar usuário.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.json(results[0]);
        });
    });
});

router.put('/atualizar/:id_usuario', upload.single('arquivo_blob'), (req, res) => {
    const { id_usuario } = req.params;
    const { Nome, Email, Senha, Premium, Data_nascimento, Foto, Tema, Idioma, Notificacao, Type } = req.body;

    if (!Nome || !Email || !Senha || !Data_nascimento || !Premium || !Foto || !Tema || !Idioma || !Notificacao || !Type) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    const binaryBlobData = req.file.buffer
    const updateUsuario = `
        UPDATE usuario
        SET Nome = ?, Email = ?, Senha = ?, Premium = ?, Data_Nascimento = ?, Foto = ?, Tema = ?, Idioma = ?, Notificacao = ?, fototype = ?
        WHERE Id_Usuario = ?
    `;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(updateUsuario, [Nome, Email, Senha, Premium, Data_nascimento, binaryBlobData, Tema, Idioma, Notificacao, Type, id_usuario], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao atualizar usuário:', err);
                return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.json({ mensagem: 'Usuário atualizado com sucesso!' });
        });
    });
})

router.get('/verificar-usuario', (req, res)=>{
    const { email } = req.query
    if (!email) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
     const query = `
        UPDATE usuario
        SET confirma = true
        WHERE Email = ?
    `;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(query, [email], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao atualizar usuário:', err);
                return res.status(500).json({ error: 'Erro ao atualizar usuário.'});
            }

            if (result.affectedRows === 0) {
                return res.status(404).send(`
                    <div style="text-align: center; padding: 50px;">
                        <h1>Ops!</h1>
                        <p>Usuário não encontrado ou sua conta já estava verificada.</p>
                    </div>
                `);
            }
            if (result.affectedRows > 0) {
                // HTML Estilizado de Boas-Vindas
                res.send(`
                    <!DOCTYPE html>
                    <html lang="pt-BR">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Conta Verificada</title>
                        <style>
                            body {
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                background-color: #f4f9f9;
                                color: #333;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                padding: 20px;
                            }
                            .card {
                                background: white;
                                padding: 40px;
                                border-radius: 20px;
                                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                                max-width: 500px;
                                text-align: center;
                                border-top: 5px solid #805BEF;
                            }
                            h1 {
                                color: #805BEF;
                                font-size: 24px;
                                margin-bottom: 10px;
                            }
                            p {
                                font-size: 16px;
                                line-height: 1.6;
                                color: #666;
                                margin-bottom: 20px;
                            }
                            .icon {
                                font-size: 50px;
                                margin-bottom: 20px;
                                color: #805BEF;
                            }
                            .footer {
                                font-size: 12px;
                                color: #999;
                                margin-top: 30px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <h1>Que alegria ter seus pets conosco!</h1>
                            
                            <p>Sua conta foi verificada.</p>
                            
                            <p>Estamos muito felizes por confiar em nossa equipe.</p>
                            
                            <p>Agora, relaxe e aproveite o app, lembre-se o melhor cuidado é o carinho 💜.</p>

                            <p style="font-size: 14px; color: #888;">Pode fechar esta tela e voltar para o aplicativo.</p>

                            <div class="footer">
                                Com amor,<br>
                                Asparagus Solutions
                            </div>
                        </div>
                    </body>
                    </html>
                `);
            }
        });
    });
})

router.get('/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    if (!id_usuario) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    const query = `
        SELECT * FROM usuario
        WHERE Id_Usuario = ?
    `;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(query, [id_usuario], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erro ao buscar usuário:', err);
                return res.status(500).json({ error: 'Erro ao buscar usuário' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.json(results[0]);
        });
    });
});




module.exports = router;











