const express = require('express');
const app = express();
const comedouroRoutes = require('./routes/comedouro');
const usuarioRoutes = require('./routes/usuario');
const petRoutes = require('./routes/pet');
const postagensRoutes = require('./routes/postagens');
const compromissosRoutes = require('./routes/compromissos');
const perguntasRoutes = require('./routes/perguntas');
const db = require('./db'); // Conexão com banco

app.use(express.json()); // Habilita receber JSON
app.use('/comedouro', comedouroRoutes); // Usa as rotas
app.use('/usuario' , usuarioRoutes)
app.use('/pet' , petRoutes)
app.use('/postagens' , postagensRoutes)
app.use('/compromissos', compromissosRoutes);
app.use('/perguntas', perguntasRoutes);

// Rota padrão de teste
app.get('/', (req, res) => {
  res.send('API do Comedouro funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
