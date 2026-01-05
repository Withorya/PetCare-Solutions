const express = require('express');
const router = express.Router();
const db = require('../db');
const e = require('express');

router.get('usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    if (!id_usuario) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
    }
    const query = `
        SELECT * FROM compromissos
        WHERE Id_Usuario = ?
        ORDER BY Data DESC
    `;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        connection.query(query, [id_usuario], (err, results) => {
            connection.release();
            if (err) {
                console.error('Erro ao buscar compromissos:', err);
                return res.status(500).json({ error: 'Erro ao buscar compromissos.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Nenhum compromisso encontrado.' });
            }
            res.status(200).json(results);
        });
    })
})

router.get('/pet/:id_pet', (req, res) => {
    const { id_pet } = req.params;
    if (!id_pet) {
        return res.status(400).json({ error: 'ID do pet é obrigatório.' });
    }
    const query = `    SELECT c.Id_Compromisso, c.Data, c.Descricao, c.Titulo, c.Horario, c.Id_Pet
    FROM compromissos c 
    JOIN pet p ON c.Id_Pet = p.id_pet
    WHERE p.id_pet = ?
    `;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        connection.query(query, [id_pet], (err, results) => {
            connection.release();
            if (err) {
                console.error('Erro ao buscar compromissos do pet:', err);
                return res.status(500).json({ error: 'Erro ao buscar compromissos do pet.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Nenhum compromisso encontrado para este pet.' });
            }
            res.status(200).json(results);
        });
    });
});

router.get('/:id_compromisso', (req, res) => {
    const { id_compromisso } = req.params;
    if (!id_compromisso) {
        return res.status(400).json({ error: 'ID do compromisso é obrigatório.' });
    }
    const query = `
        SELECT * FROM compromissos
        WHERE Id_Compromisso = ?
    `;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        connection.query(query, [id_compromisso], (err, results) => {
            connection.release();
            if (err) {
                console.error('Erro ao buscar compromisso:', err);
                return res.status(500).json({ error: 'Erro ao buscar compromisso.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Compromisso não encontrado.' });
            }
            res.status(200).json(results[0]);
        });
    });
});

router.post('/', (req, res) => {
    const { id_usuario, Data, descricao, titulo, horario, id_pet } = req.body;
    if (!id_usuario || !Data || !descricao || !titulo || !horario, id_pet) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    const query = `
    INSERT INTO compromissos (Id_Usuario, Data, Descricao, Titulo, Horario, Id_Pet)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        connection.query(query, [id_usuario, Data, descricao, titulo, horario, id_pet], (err, results) => {
            connection.release();
            if (err) {
                console.error('Erro ao criar compromisso:', err);
                return res.status(500).json({ error: 'Erro ao criar compromisso.' });
            }
            res.status(201).json({ mensagem: 'Compromisso criado com sucesso.', id: results.insertId });
        });
    })
})

router.delete('delete/:id_compromisso', (req, res) => {
    const { id_compromisso } = req.params;
    if (!id_compromisso) {
        return res.status(400).json({ error: 'ID do compromisso é obrigatório.' });
    }
    const query = `
        DELETE FROM compromissos
        WHERE Id_Compromisso = ?
    `;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        connection.query(query, [id_compromisso], (err, results) => {
            connection.release();
            if (err) {
                console.error('Erro ao deletar compromisso:', err);
                return res.status(500).json({ error: 'Erro ao deletar compromisso.' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Compromisso não encontrado.' });
            }
            res.status(200).json({ mensagem: 'Compromisso deletado com sucesso.' });
        });
    })
});

router.put('update/:id_compromisso', (req, res) => {
    const { id_compromisso } = req.params;
    const { Data, descricao, titulo, horario, id_pet } = req.body;

    if (!id_compromisso || !Data || !descricao || !titulo || !horario || !id_pet) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const query = `
        UPDATE compromissos
        SET Data = ?, Descricao = ?, Titulo = ?, Horario = ?, Id_Pet = ?
        WHERE Id_Compromisso = ?
    `;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(query, [Data, descricao, titulo, horario, id_pet, id_compromisso], (err) => {
            connection.release();

            if (err) {
                console.error('Erro ao atualizar compromisso:', err);
                return res.status(500).json({ error: 'Erro ao atualizar compromisso.' });
            }
            if (this.affectedRows === 0) {
                return res.status(404).json({ error: 'Compromisso não encontrado.' });
            }
            res.json({ mensagem: 'Compromisso atualizado com sucesso.' });
        });
    });
});

module.exports = router;