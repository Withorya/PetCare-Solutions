const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/novaPergunta', (req, res) => {
    const { id_Usuario, conteudo, id_pet } = req.body;
    if (!id_Usuario || !conteudo || !id_pet) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const insertPergunta = `
            INSERT INTO chatperguntas (Id_Usuario, Conteudo, Id_Pet)
            VALUES (?, ?, ?)
        `;

        connection.query(insertPergunta, [id_Usuario, conteudo, id_pet], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao inserir pergunta:', err);
                return res.status(500).json({ error: 'Erro ao inserir pergunta.' });
            }

            res.status(201).json({ mensagem: 'Pergunta cadastrada com sucesso!', id_pergunta: result.insertId });
        });
    });
})  

router.get('/perguntasPet/:id_Usuario', (req, res) => {
    const { id_Usuario } = req.params;

    if (!id_Usuario) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
    }

    const query = `
        SELECT * FROM chatperguntas
        WHERE Id_Usuario = ?
    `;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        connection.query(query, [id_Usuario], (err, results) => {
            connection.release();
            if (err) {
                console.error('Erro ao buscar perguntas:', err);
                return res.status(500).json({ error: 'Erro ao buscar perguntas.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Nenhuma pergunta encontrada para este usuário.' });
            }
            res.status(200).json(results);
        });
    });
});

module.exports = router;