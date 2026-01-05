const express = require('express');
const router = express.Router();
const db = require('../db');
const multer  = require('multer');
const { connect } = require('./usuario');
const e = require('express');
const upload = multer({ storage: multer.memoryStorage() });



router.put('/editarPost/:id_postagem', upload.single('arquivo_blob'), (req, res) => {
    const { id_postagem } = req.params;
    const { Titulo, Conteudo } = req.body;
    const binaryBlobData = req.file.buffer
    if (!Titulo || !Conteudo) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const updatePost = `
            UPDATE postagens
            SET Titulo = ?, Conteudo = ?, fotoPost = ?
            WHERE Id_post = ?
        `;

        connection.query(updatePost, [Titulo, Conteudo, binaryBlobData, id_postagem], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao atualizar postagem:', err);
                return res.status(500).json({ error: 'Erro ao atualizar postagem.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Postagem não encontrada.' });
            }

            res.status(200).json({ mensagem: 'Postagem atualizada com sucesso!' });
        });
    });
})

router.delete('/deletarPost/:id_postagem', (req, res) => {
    const { id_postagem } = req.params; 
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const deletePost = `
            DELETE FROM postagens
            WHERE Id_post = ?
        `;

        connection.query(deletePost, [id_postagem], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao deletar postagem:', err);
                return res.status(500).json({ error: 'Erro ao deletar postagem.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Postagem não encontrada.' });
            }

            res.status(200).json({ mensagem: 'Postagem deletada com sucesso!' });
        });
    });
})

router.delete('/deletarResposta/:id_resposta', (req, res) => {
    const { id_resposta } = req.params;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const deleteResposta = `
            DELETE FROM respostas
            WHERE Id_Resposta = ?
        `;

        connection.query(deleteResposta, [id_resposta], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao deletar resposta:', err);
                return res.status(500).json({ error: 'Erro ao deletar resposta.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Resposta não encontrada.' });
            }

            res.status(200).json({ mensagem: 'Resposta deletada com sucesso!' });
        });
    });
})

router.put('/editarResposta/:id_resposta', (req, res) => {
    const { id_resposta } = req.params;
    const { Conteudo } = req.body;
    if (!Conteudo) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const updateResposta = `
            UPDATE respostas
            SET Conteudo = ?
            WHERE Id_Resposta = ?
        `;

        connection.query(updateResposta, [Conteudo, id_resposta], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao atualizar resposta:', err);
                return res.status(500).json({ error: 'Erro ao atualizar resposta.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Resposta não encontrada.' });
            }

            res.status(200).json({ mensagem: 'Resposta atualizada com sucesso!' });
        });
    });
})

router.put('/curtirPost/:id_postagem', (req, res) => {
    const { id_postagem } = req.params;
    const { id_usuario } = req.body;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        const curtirPost = `
            UPDATE postagens
            SET likes = likes + 1
            WHERE Id_post = ?
        `;
        connection.query(curtirPost, [id_postagem], (err, result) => {
            connection.release();
            if (err) {
                console.error('Erro ao curtir postagem:', err);
                return res.status(500).json({ error: 'Erro ao curtir postagem.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Postagem não encontrada.' });
            }
            queryInsertLike = `
                INSERT INTO likes (Id_Usuario, Id_Post)
                VALUES (?, ?)
            `;
            connection.query(queryInsertLike, [id_usuario, id_postagem], (err2, result2) => {
                connection.release();
                if (err2) {
                    console.error('Erro ao registrar like:', err2);
                    return res.status(500).json({ error: 'Erro ao registrar like.' });
                }
            });
            res.status(200).json({ mensagem: 'Postagem curtida com sucesso!' });
        });
    });
})

router.put('/curtirResposta/:id_resposta', (req, res) => {
    const { id_resposta } = req.params;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        const curtirResposta = `
            UPDATE respostas
            SET likes = likes + 1
            WHERE Id_Resposta = ?
        `;
        
        connection.query(curtirResposta, [id_resposta], (err, result) => {
            connection.release();
            if (err) {
                console.error('Erro ao curtir resposta:', err);
                return res.status(500).json({ error: 'Erro ao curtir resposta.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Resposta não encontrada.' });
            }
            res.status(200).json({ mensagem: 'Resposta curtida com sucesso!' });
        });
    });
})

router.post('/novoPost', upload.single('arquivo_blob'), (req, res) => {
    const { id_usuario, Titulo, Conteudo, DataPost } = req.body;
    if (!id_usuario || !Titulo || !Conteudo || !DataPost) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    let binaryBlobData
    if (req.file) {
         binaryBlobData = req.file.buffer
    }else{
         binaryBlobData = ""
    }
    
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const insertPost = `
            INSERT INTO postagens (Id_Usuario, Titulo, Conteudo, DataPost, fotoPost)
            VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(insertPost, [id_usuario, Titulo, Conteudo, DataPost, binaryBlobData], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao inserir postagem:', err);
                return res.status(500).json({ error: 'Erro ao inserir postagem.' });
            }

            res.status(201).json({ mensagem: 'Postagem criada com sucesso!', id_post: result.insertId });
        });
    });
})

router.post('/novaResposta', (req, res) => {
    const { id_usuario, id_postagem, Conteudo, DataResposta } = req.body;
    if (!id_usuario || !id_postagem || !Conteudo || !DataResposta) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        const insertResposta = `
            INSERT INTO respostas (Id_Usuario, Id_post, Conteudo, DataResposta)
            VALUES (?, ?, ?, ?)
        `;

        connection.query(insertResposta, [id_usuario, id_postagem, Conteudo, DataResposta], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erro ao inserir resposta:', err);
                return res.status(500).json({ error: 'Erro ao inserir resposta.' });
            }

            res.status(201).json({ mensagem: 'Resposta criada com sucesso!', id_resposta: result.insertId });
        });
    });
})

router.get('/meusPosts/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    if (!id_usuario) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
    }

    const query = `
        SELECT * FROM postagens
        WHERE Id_Usuario = ?  
        ORDER BY DataPost DESC
    `;
  
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        connection.query(query, [id_usuario], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erro ao buscar postagens:', err);
                return res.status(500).json({ error: 'Erro ao buscar postagens.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Nenhuma postagem encontrada.' });
            }
            res.status(200).json(results);
            
        });
    })
});

router.get('/respostas/:id_postagem', (req, res) => {
    const { id_postagem } = req.params;

    if (!id_postagem) {
        return res.status(400).json({ error: 'ID da postagem é obrigatório.' });
    }

    const query = `
        SELECT * FROM respostas
        WHERE Id_post = ?
    `;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(query, [id_postagem], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erro ao buscar respostas:', err);
                return res.status(500).json({ error: 'Erro ao buscar respostas.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Nenhuma resposta encontrada para esta postagem.' });
            }

            res.json(results);
        });
    });
})

router.get('/meuslikes/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    if (!id_usuario) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
    }
    const query = `
        SELECT * FROM likes
        WHERE Id_Usuario = ?
    `;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        connection.query(query, [id_usuario], (err, results) => {
            connection.release();
            if (err) {
                console.error('Erro ao buscar likes:', err);
                return res.status(500).json({ error: 'Erro ao buscar likes.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Nenhum like encontrado para este usuário.' });
            }
            res.status(200).json(results);
        });
    });
})

router.get('/pagination/page=:page&size=:size',  (req, res) => {
  // 1. Obter parâmetros da consulta (query params)
  // Valores padrão: página 1, tamanho da página de 10 itens
  const {page , size } = req.params // Renomeado de 'limit' para 'size'
  const pageNumeric = Number(page)
  const sizeNumeric = Number(size)
  // Garantir que os valores sejam positivos
  if (pageNumeric < 1 || sizeNumeric < 1) {
    return res.status(400).json({ error: 'Parâmetros de página e tamanho (size) devem ser positivos.' });
  }
  // 2. Calcular o índice de início (startIndex/offset)
  // Fórmula: startIndex = (número da página - 1) * tamanho da página
  const startIndex = (pageNumeric - 1) * sizeNumeric;
  const endIndex = startIndex + sizeNumeric;
  const query = `
        SELECT 
            p.*, 
            u.Nome AS nome_usuario 
        FROM 
            postagens AS p
        INNER JOIN 
            usuario AS u ON p.Id_Usuario = u.Id_Usuario
        ORDER BY 
            p.DataPost 
        LIMIT ? OFFSET ?
    `;
    
      //SELECT 
//         p.*, 
//         u.nome AS nome_usuario 
//     FROM 
//         postagens AS p
//     INNER JOIN 
//         usuarios AS u ON p.id_usuario = u.id
//     ORDER BY 
//         p.Id_Post 
//     LIMIT ? OFFSET ?
// `;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });
        connection.query(query, [sizeNumeric, startIndex], (err, results) => {
            connection.release();
            if (err) {
                return res.status(500).json({ error: 'Erro ao buscar posts.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Sem mais postagens' });
            }
            const totalItems = results.length;
            const totalPages = Math.ceil(totalItems / size);
            res.status(200).json({
                data: results,
                pagination: {
                    currentPage: pageNumeric,
                    itemsPerPage: sizeNumeric, // Usando 'size' aqui
                    totalItems: totalItems,
                    totalPages: totalPages
                }
            });
            
        })
    })
});
  // 4. Calcular metadados para a resposta
 
router.put('/descurtirPost/:id_post', (req,res) =>{
    const { id_usuario } = req.body
    const { id_post } = req.params
    const query = `
        DELETE FROM likes
        WHERE Id_post = ? AND Id_Usuario = ?
    `
    db.getConnection((err, connection)=>{
        if (err) return res.status(500).json({error:"Erro de conexão com o banco."})
        connection.query(query, [id_post, id_usuario], (err, result)=>{
            connection.release()
            if(err){ 
                return res.status(500).json({error:"Erro ao remover like."})
            }
                const update = `
                UPDATE postagens 
                SET likes = likes - 1
                WHERE Id_post = ?
            `
            connection.query( update, [id_post], (erro, resultado)=>{
                if(erro){
                    return res.status(500).json({error:"Erro ao atualizar número de likes."})
                }
                if(resultado.affectedRows === 0 ) return res.status(404).json({error:'Postagem não encontrada'})
                res.status(200).json({mensagem:"Like removido com sucesso!"})
            })
            
        })
    })
})

router.put('/descurtirResposta/:id', (req,res)=>{
    const { id } = req.params
    const query = `
        UPDATE respostas
        SET likes = likes - 1
        WHERE Id_respostas = ?`
        db.getConnection((err, connection)=>{
            if (err) return res.status(500).json({error:"Erro de conexão com o banco."})
            connection.query( query, [id], (err, result)=>{
                connection.release()
                if(err){
                    return res.status(500).json({error:"Erro ao atualizar número de likes."})
                }
                if(res.affectedRows === 0 ) return res.status(404).json({error:'Postagem não encontrada'})
                res.status(200).json({mensagem:"Like removido com sucesso!"})
            })
        })     
})

router.get('/tacurtido', (req,res)=>{
    const { id_post, id_usuario } =  req.query
    const query = `
        SELECT * FROM likes
        WHERE Id_post = ? AND Id_Usuario = ?
    `
    db.getConnection((err, connection)=>{
        if (err) return res.status(500).json({ error: "Erro de conexão com o banco."})
        connection.query(query, [ id_post, id_usuario], (err, results)=>{
            connection.release()
            if (err) {
                return res.status(500).json({ error: "Erro ao buscar likes."})
            }
            if (results.length===0) {
                return res.status(404).json({curtido: false})
            }
            return res.status(200).json({curtido: true})
            
        })
    })
})

router.get('/:id_postagem', (req, res) => {
    const { id_postagem } = req.params;

    if (!id_postagem) {
        return res.status(400).json({ error: 'ID da postagem é obrigatório.' });
    }

    const query = `
        SELECT * FROM postagens
        WHERE Id_post = ?
    `;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco.' });

        connection.query(query, [id_postagem], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erro ao buscar postagem:', err);
                return res.status(500).json({ error: 'Erro ao buscar postagem.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Postagem não encontrada.' });
            }

            res.json(results[0]);
        });
    });
})

module.exports = router;













