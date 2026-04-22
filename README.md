# Sistema de Login com Banco de Dados

Este é um sistema simples de login e registro usando Node.js, Express, SQLite e bcrypt para armazenamento seguro de senhas.

## Funcionalidades
- Registro de usuários com email e senha
- Login de usuários
- Recuperação de senha (esqueci a senha) com código de reset
- **Design profissional escuro** com animações suaves e gradientes
- Fundo dinâmico com imagem personalizada
- Senhas armazenadas com hash (bcrypt) para segurança
- Banco de dados SQLite local

## Como usar

### 1. Instalar dependências
Execute no terminal (no diretório do projeto):
```
npm install
```

### 2. Executar o servidor
```
npm start
```
O servidor rodará em `http://localhost:3000`.

### 3. Acessar o site
Abra `http://localhost:3000` no navegador. Você verá o formulário de login com design profissional escuro. Clique em "Cadastre-se" para registrar um novo usuário.

Após login ou registro bem-sucedido, você será redirecionado para `Home/index.html` (página inicial do site, com todos os arquivos CSS, JS e imagens).

Para recuperar senha:
- Clique em "Esqueci a senha" no login.
- Insira o email e clique em "Enviar Código".
- O código aparecerá no console do servidor (simulação de email).
- Insira o código e uma nova senha para resetar.

### 4. API Endpoints
- `POST /register`: Registrar novo usuário (JSON: {email, senha})
- `POST /login`: Fazer login (JSON: {email, senha})
- `POST /forgot-password`: Solicitar reset de senha (JSON: {email}) - retorna código no console
- `POST /reset-password`: Resetar senha (JSON: {token, novaSenha})

## Segurança
- Senhas são hashadas com bcrypt (10 rounds).
- Emails são únicos no banco.
- **Nunca armazene senhas em texto plano!** Isso é apenas um exemplo educacional.

## Estrutura do Banco
Tabela `usuarios`:
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `email`: TEXT UNIQUE NOT NULL
- `senha_hash`: TEXT NOT NULL
- `reset_token`: TEXT (para recuperação de senha)
- `reset_expiry`: DATETIME (expiração do token)

## Dependências
- express: Servidor web
- sqlite3: Banco de dados
- bcrypt: Hashing de senhas
- body-parser: Parse de JSON