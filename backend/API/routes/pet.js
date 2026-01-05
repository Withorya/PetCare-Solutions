const express = require('express');
const router = express.Router();
const db = require('../db');
const multer  = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/novoPet', (req, res) => {
    const { id_Usuario, Nome, Especie, data_nascimento, Raca, Peso, Cor, Porte, Genero} = req.body;
    if (!id_Usuario || !Nome || !Especie || !data_nascimento || !Raca || !Peso || !Cor || !Porte || !Genero) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const insertPet = `
            INSERT INTO pet (Id_Usuario, Nome, Especie, data_nascimento, Raca, Peso, Cor, Porte, sexo, foto)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '')
        `;

        connection.query(insertPet, [id_Usuario, Nome, Especie, data_nascimento, Raca, Peso, Cor, Porte, Genero], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao inserir pet:', err);
                return res.status(500).json({ error: 'Erro ao inserir pet.' });
            }

            res.status(201).json({ mensagem: 'Pet cadastrado com sucesso!', id_pet: result.insertId });
        });
    });
})

router.get('/meusPets/:id_Usuario', (req, res) => {
    const { id_Usuario } = req.params;

    if (!id_Usuario) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
    }

    const query = `
        SELECT * FROM pet
        WHERE Id_Usuario = ?
    `;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(query, [id_Usuario], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erro ao buscar pets:', err);
                return res.status(500).json({ error: 'Erro ao buscar pets.' });
            }

            res.json(results);
        });
    });
})

router.put('/atualizarPet/:id_pet', upload.single('arquivo_blob'), (req, res) => {
    const { id_pet } = req.params;
    const { Nome, Especie, data_nascimento, Raca, Peso, Cor, Porte, Genero, descricao_saude, Type} = req.body;

    if (!id_pet || !Nome || !Especie || !data_nascimento || !Raca || !Peso || !Cor || !Porte || !Genero || !descricao_saude || !Type) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    const PesoNumerico = parseFloat(Peso)
    const binaryBlobData = req.file.buffer
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const updatePet = `
            UPDATE pet
            SET Nome = ?, Especie = ?, data_nascimento = ?, Raca = ?, Peso = ?, Cor = ?, Porte = ?, sexo = ?, descricao_saude = ?, foto = ?, fototype = ?
            WHERE id_pet = ?
        `;

        connection.query(updatePet, [Nome, Especie, data_nascimento, Raca, PesoNumerico, Cor, Porte, Genero, descricao_saude, binaryBlobData, Type, id_pet], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao atualizar pet:', err);
                return res.status(500).json({ error: 'Erro ao atualizar pet.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Pet não encontrado.' });
            }

            res.json({ mensagem: 'Pet atualizado com sucesso!' });
        });
    });
})

router.get('/:id_pet', (req, res) => {
    const { id_pet } = req.params;

    if (!id_pet) {
        return res.status(400).json({ error: 'ID do pet é obrigatório.' });
    }

    const query = `
        SELECT * FROM pet
        WHERE id_pet = ?
    `;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(query, [id_pet], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erro ao buscar pet:', err);
                return res.status(500).json({ error: 'Erro ao buscar pet.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Pet não encontrado.' });
            }

            res.json(results[0]);
        });
    });
})

router.post('/vacinarPet', (req, res) => {
    const { id_pet, id_usuario, nomeVac, dataVacina, dataProxDose } = req.body
    if (!id_pet || !nomeVac || !dataVacina || !id_usuario) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const insertVacina = `
            INSERT INTO vacinas (id_pet, id_usuario, nomeVac, dataVacina, dataProxDose )
            VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(insertVacina, [id_pet, id_usuario, nomeVac, dataVacina, dataProxDose ], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao inserir vacina:', err);
                return res.status(500).json({ error: 'Erro ao inserir vacina.' });
            }

            res.status(201).json({ mensagem: 'Vacina registrada com sucesso!', id_vacina: result.insertId });
        });
    }); 
})

router.get('/vacinasPet/:id_pet', (req, res) => {
    const { id_pet } = req.params;

    if (!id_pet) {
        return res.status(400).json({ error: 'ID do pet é obrigatório.' });
    }

    const query = `
        SELECT * FROM vacinas
        WHERE id_pet = ?
    `;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(query, [id_pet], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erro ao buscar vacinas:', err);
                return res.status(500).json({ error: 'Erro ao buscar vacinas.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Nenhuma vacina encontrada para este pet.' });
            }

            res.json(results);
        });
    });
})


module.exports = router;
