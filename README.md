# Projeto Água Inteligente - Página estática

Arquivos:
- `index.html` - marcação da página
- `styles.css` - estilos
- `script.js` - interações simples (menu mobile, smooth scroll, animações)

Como testar localmente (estático):
1. Abra `pages/index.html` no navegador (duplo clique) ou rode um servidor estático, por exemplo com o VS Code Live Server.

Como rodar o servidor Node (API básica):
1. Abra um terminal na pasta do projeto (`c:\Users\Aluno_Tarde\Desktop\site`).
2. Inicialize um package.json (se ainda não existir):

```powershell
npm init -y
```

3. Instale o Express:

```powershell
npm install express
```

4. Inicie o servidor:

```powershell
node server.js
```

O servidor ficará disponível em `http://localhost:3000` (ou em outra porta, se 3000 estiver ocupada) e expõe:
- `POST /api/requests` — recebe pedidos do formulário e salva em `data/requests.json`.
- `GET /api/requests` — lista os pedidos salvos (útil para administração).

Resolvendo conflito de porta (EADDRINUSE) no Windows:

- Se você vir um erro indicando que a porta 3000 está em uso, pode encerrar o processo que a está usando com os comandos do PowerShell:

```powershell
# lista processos que escutam na porta 3000
netstat -a -n -o | Select-String ":3000"

# mate o processo pelo PID (substitua <PID>)
taskkill /PID <PID> /F
```

O servidor foi atualizado para tentar automaticamente a próxima porta disponível (porta + 1) se a porta configurada estiver ocupada.

Notas:
- As imagens (`images/*`) são placeholders — substitua pelos seus arquivos.
- Se quiser, posso adicionar validação no servidor mais robusta, autenticação para o endpoint de listagem ou envio de e-mails ao receber pedido.
