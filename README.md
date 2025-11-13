# Projeto Água Inteligente 💧🌱

Sistema inteligente de irrigação automatizada para hortas comunitárias, desenvolvido com Arduino e sensores de umidade.

## 🎯 Sobre o Projeto

O **Água Inteligente** é uma solução de baixo custo para automatizar a irrigação de hortas, economizando até 60% de água através de sensores que monitoram a umidade do solo em tempo real.

## 🌟 Funcionalidades do Site

### Páginas Disponíveis
- **Início** (`index.html`) - Landing page com hero, seção de doação, estatísticas de impacto
- **Sobre** (`sobre.html`) - Missão, valores e impactos do projeto
- **Como Funciona** (`como-funciona.html`) - Explicação técnica do sistema com fluxo visual
- **FAQ** (`faq.html`) - Perguntas frequentes com accordion interativo
- **Contato** (`contato.html`) - Formulário de solicitação de instalação

### Recursos Implementados
✅ Sistema de doação com PIX e cartão de crédito  
✅ Geração automática de QR Code PIX (padrão BR Code EMV)  
✅ Validação de cartão com algoritmo de Luhn  
✅ Modo escuro totalmente funcional  
✅ Design responsivo (mobile, tablet, desktop)  
✅ Animações suaves e transições  
✅ Ícones SVG customizados  
✅ Formulário de contato com validação  
✅ FAQ com categorias e filtros  

## 📁 Estrutura de Arquivos

```
Projeto_AguaInteligente/
├── pages/
│   ├── index.html          # Página inicial
│   ├── sobre.html          # Sobre o projeto
│   ├── como-funciona.html  # Funcionamento técnico
│   ├── faq.html            # Perguntas frequentes
│   └── contato.html        # Formulário de contato
├── styles/
│   └── styles.css          # Estilos completos (492+ linhas)
├── js/
│   └── script.js           # Lógica JavaScript (900+ linhas)
├── data/
│   └── requests.json       # Armazenamento de solicitações
├── images/                 # Imagens e logo
├── documents/              # Documentos do projeto
├── server.js               # Servidor Node.js
├── package.json            # Dependências
└── README.md               # Este arquivo
```

## 🚀 Como Executar

### Opção 1: Servidor Node.js (Recomendado)
```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start
# ou
node server.js
```

Acesse: `http://localhost:3000`

### Opção 2: Servidor Estático
Use qualquer servidor HTTP local:
```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000

# VS Code Live Server (extensão)
```

## 💳 Sistema de Doação

### PIX
- Geração automática de BR Code (padrão EMV)
- QR Code gerado com QRCode.js
- Validação CRC16-CCITT
- Chave PIX: email configurável
- Valor mínimo: R$ 1,00

### Cartão de Crédito
- Validação com algoritmo de Luhn
- Suporte a bandeiras: Visa, Mastercard, Elo, Amex
- Validação de data de expiração
- Validação de CVV (3-4 dígitos)
- Validação de email

## 🎨 Tema Escuro

Ative o modo escuro clicando no ícone de lua no header. As preferências são salvas no `localStorage`.

**Variáveis CSS:**
```css
--text: cores de texto
--background: fundo da página
--primary: verde principal (#6cf830)
--accent: azul de destaque (#69aedf)
```

## 📱 Responsividade

Breakpoints:
- Desktop: > 900px
- Tablet: 600px - 900px
- Mobile: < 600px

## 🔧 Tecnologias Utilizadas

- **HTML5** - Semântica e acessibilidade
- **CSS3** - Grid, Flexbox, variáveis customizadas, animações
- **JavaScript ES6+** - Vanilla JS (sem frameworks)
- **QRCode.js** - Geração de QR codes
- **Node.js + Express** - Backend para API de contato

## 📊 Meta de Doações

- Meta atual: **R$ 50.000,00**
- Arrecadado: **R$ 0,00** (atualizado em tempo real)
- Barra de progresso visual

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto para fins educacionais e comunitários.

## 📞 Contato

- **Email:** contato@aguainteligente.com.br
- **Localização:** São Paulo, SP - Brasil
- **Horário:** Seg-Sex 9h-18h, Sáb 9h-13h

---

Desenvolvido com 💚 para hortas comunitárias

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
