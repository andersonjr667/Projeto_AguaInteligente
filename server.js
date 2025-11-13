// Simple Express server to handle installation requests
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static site (pages, styles, js, images)
app.use(express.static(path.join(__dirname, '/')));

const DATA_FILE = path.join(__dirname, 'data', 'requests.json');

function readRequests(){
	try{
		const raw = fs.readFileSync(DATA_FILE, 'utf8');
		return JSON.parse(raw || '[]');
	}catch(e){
		return [];
	}
}

function writeRequests(arr){
	fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

// POST /api/requests - create a new installation request
app.post('/api/requests', (req, res)=>{
	const body = req.body || {};
	// basic validation
	if(!body.name || !body.email || !body.address || !body.size){
		return res.status(400).send('Campos obrigatórios: name, email, address, size');
	}
	const requests = readRequests();
	const id = Date.now();
	const item = Object.assign({ id, createdAt: new Date().toISOString() }, body);
	requests.push(item);
	try{
		writeRequests(requests);
		res.json({ id });
	}catch(err){
		res.status(500).send('Erro ao salvar pedido');
	}
});

// GET /api/requests - list requests (for admin)
app.get('/api/requests', (req, res)=>{
	const requests = readRequests();
	res.json(requests);
});

// Serve the pages index at root
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Friendly routes for pages
app.get('/sobre', (req, res) => {
	res.sendFile(path.join(__dirname, 'pages', 'sobre.html'));
});

app.get('/contato', (req, res) => {
	res.sendFile(path.join(__dirname, 'pages', 'contato.html'));
});

app.get('/como-funciona', (req, res) => {
	res.sendFile(path.join(__dirname, 'pages', 'como-funciona.html'));
});

app.get('/faq', (req, res) => {
	res.sendFile(path.join(__dirname, 'pages', 'faq.html'));
});

// Start server with error handling and simple fallback to next port if in use
function startServer(port, triedPorts = new Set()){
	if(triedPorts.has(port)) return;
	triedPorts.add(port);

	const server = app.listen(port, ()=>{
		console.log(`Server running on http://localhost:${port}`);
	});

	server.on('error', (err) => {
		if(err && err.code === 'EADDRINUSE'){
			console.error(`Port ${port} is already in use.`);
			const next = port + 1;
			// try next port once
			if(!triedPorts.has(next)){
				console.log(`Attempting to start on port ${next}...`);
				setTimeout(()=> startServer(next, triedPorts), 500);
				return;
			}
			console.error('No available ports found (tried). Exiting.');
			process.exit(1);
		}
		console.error('Server error:', err);
		process.exit(1);
	});
}

startServer(PORT);
