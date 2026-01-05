const express = require('express');
const router = express.Router();
const db = require('../db');

// Criar pet e alimentador
router.post('/novo', (req, res) => {
  const { id_usuario, id_pet, tipo_racao, intervalo_horas, gramagem } = req.body;

  if (!id_usuario || !intervalo_horas || !gramagem) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

    const insertAlimentador = `
      INSERT INTO alimentador (id_pet, Id_Usuario, tipo_raçao, intervalo_horas, Gramagem, Ra_Extra, ultima_refeicao)
      VALUES (?, ?, ?, ?, ?, 0, NOW())
    `;

    connection.query(
      insertAlimentador,
      [id_pet, id_usuario, tipo_racao || '', intervalo_horas, gramagem],
      (err) => {
        connection.release();

        if (err) {
          console.error('Erro ao inserir alimentador:', err);
          return res.status(500).json({ error: 'Erro ao inserir alimentador.' });
        }

        res.status(201).json({ mensagem: 'Alimentador criado com sucesso!', id_pet });
      }
    );
  });
});

// Buscar dados do alimentador por pet
router.get('/:id_pet', (req, res) => {
  const { id_pet } = req.params;

  const query = `
    SELECT p.nome, p.especie, p.data_nascimento,
           a.intervalo_horas, a.Gramagem, a.tipo_raçao, a.Ra_Extra, a.ultima_refeicao
    FROM pet p
    JOIN alimentador a ON p.id_pet = a.id_pet
    WHERE p.id_pet = ?
  `;

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Erro de conexão' });

    connection.query(query, [id_pet], (err, results) => {
      connection.release();

      if (err) {
        console.error('Erro ao buscar dados:', err);
        return res.status(500).json({ error: 'Erro ao buscar dados.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Pet não encontrado.' });
      }

      const pet = results[0];

      const especie = pet.especie ? pet.especie.toLowerCase() : "";
      const tipo = pet.tipo_raçao ? pet.tipo_raçao.toLowerCase() : "";

      // Definição da gramagem automática
      let gramasPorSegundo = 10;

      if (especie.includes("gato") && tipo.includes("filhote")) {
        gramasPorSegundo = 15;
      } else if (especie.includes("gato") && tipo.includes("adulto")) {
        gramasPorSegundo = 20;
      } else if (especie.includes("cão") && tipo.includes("filhote")) {
        gramasPorSegundo = 65;
      } else if (especie.includes("cão") && tipo.includes("adulto")) {
        gramasPorSegundo = 50;
      }

      return res.json({
        ...pet,
        gramas_por_segundo: gramasPorSegundo
      });
    });
  });
});

// Atualizar alimentador (configurações)
router.put('/:id_pet', (req, res) => {
  const { id_pet } = req.params;
  const { intervalo_horas, gramagem } = req.body;

  const query = `
    UPDATE alimentador
    SET intervalo_horas = ?, Gramagem = ?
    WHERE id_pet = ?
  `;

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Erro de conexão' });

    connection.query(query, [intervalo_horas, gramagem, id_pet], (err) => {
      connection.release();

      if (err) {
        console.error('Erro ao atualizar alimentador:', err);
        return res.status(500).json({ error: 'Erro ao atualizar alimentador.' });
      }

      res.json({ mensagem: 'Alimentador atualizado com sucesso.' });
    });
  });
});

// Solicitar porção extra
router.post('/extra/:id_pet', (req, res) => {
  const { id_pet } = req.params;

  if (!id_pet) {
    return res.status(400).json({ error: 'id_pet é obrigatório.' });
  }

  const query = `
    UPDATE alimentador
    SET Ra_Extra = 1
    WHERE id_pet = ?
  `;

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Erro de conexão' });

    connection.query(query, [id_pet], (err) => {
      connection.release();

      if (err) {
        console.error('Erro ao registrar porção extra:', err);
        return res.status(500).json({ error: 'Erro ao registrar porção extra.' });
      }

      res.status(200).json({ mensagem: 'Porção extra marcada para esse pet.' });
    });
  });
});

// Limpar flag de porção extra
router.post('/limpar_extra', (req, res) => {
  const { id_pet } = req.body;

  const query = `
    UPDATE alimentador
    SET Ra_Extra = 0
    WHERE id_pet = ?
  `;

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Erro de conexão' });

    connection.query(query, [id_pet], (err) => {
      connection.release();

      if (err) {
        console.error('Erro ao limpar porção extra:', err);
        return res.status(500).json({ error: 'Erro ao limpar porção extra.' });
      }

      res.status(200).json({ mensagem: 'Porção extra limpa com sucesso.' });
    });
  });
});

// Atualizar última refeição (rota usada pelo ESP32)
router.post('/update_horario', (req, res) => {
  const { id_pet } = req.body;

  if (!id_pet) {
    return res.status(400).json({ error: 'id_pet é obrigatório.' });
  }

  const query = `
    UPDATE alimentador
    SET ultima_refeicao = NOW()
    WHERE id_pet = ?
  `;

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Erro de conexão' });

    connection.query(query, [id_pet], (err) => {
      connection.release();

      if (err) {
        console.error('Erro ao atualizar horário:', err);
        return res.status(500).json({ error: 'Erro ao atualizar horário.' });
      }

      res.status(200).json({ mensagem: 'Horário atualizado com sucesso.' });
    });
  });
});

module.exports = router;



