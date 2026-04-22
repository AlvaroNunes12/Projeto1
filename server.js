const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(express.static('.')); // Servir arquivos estáticos (HTML, CSS, JS)

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./usuarios.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    // Criar tabela se não existir
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      senha_hash TEXT NOT NULL,
      reset_token TEXT,
      reset_expiry DATETIME
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar tabela:', err.message);
      } else {
        // Adicionar colunas se não existirem (para tabelas antigas)
        db.run(`ALTER TABLE usuarios ADD COLUMN reset_token TEXT`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error('Erro ao adicionar coluna reset_token:', err.message);
          }
        });
        db.run(`ALTER TABLE usuarios ADD COLUMN reset_expiry DATETIME`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error('Erro ao adicionar coluna reset_expiry:', err.message);
          }
        });
      }
    });
  }
});

// Rota para registrar usuário
app.post('/register', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    db.run('INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)', [email, senhaHash], function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({ error: 'Email já cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao registrar usuário.' });
      }
      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar senha.' });
  }
});

// Rota para login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Email ou senha incorretos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, row.senha_hash);
    if (senhaCorreta) {
      res.json({ message: 'Login bem-sucedido!' });
    } else {
      res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
  });
});

// Rota para esqueci a senha
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório.' });
  }

  // Gerar token simples (em produção, use crypto.randomBytes)
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  db.run('UPDATE usuarios SET reset_token = ?, reset_expiry = ? WHERE email = ?', [resetToken, expiry.toISOString(), email], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao processar solicitação.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Email não encontrado.' });
    }
    // Simular envio de email (log no console)
    console.log(`Token de reset para ${email}: ${resetToken}`);
    res.json({ message: 'Instruções enviadas para o email. (Verifique o console do servidor para o token)' });
  });
});

// Rota para resetar senha
app.post('/reset-password', async (req, res) => {
  const { token, novaSenha } = req.body;
  if (!token || !novaSenha) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
  }

  db.get('SELECT * FROM usuarios WHERE reset_token = ? AND reset_expiry > ?', [token, new Date().toISOString()], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar token.' });
    }
    if (!row) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    try {
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
      db.run('UPDATE usuarios SET senha_hash = ?, reset_token = NULL, reset_expiry = NULL WHERE id = ?', [novaSenhaHash, row.id], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar senha.' });
        }
        res.json({ message: 'Senha atualizada com sucesso!' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao processar senha.' });
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});