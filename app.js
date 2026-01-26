const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Base de données en mémoire
let todos = [
  { id: 1, title: 'Apprendre CI/CD', completed: false },
  { id: 2, title: 'Déployer sur Render', completed: false }
];
let nextId = 3;

// ===== ROUTES =====

// GET /
app.get('/', (req, res) => {
  res.json({
    message: 'API TODO - CI/CD Demo',
    endpoints: {
      'GET /todos': 'Liste des todos',
      'GET /todos/:id': 'Un todo spécifique',
      'POST /todos': 'Créer un todo',
      'PUT /todos/:id': 'Modifier un todo',
      'DELETE /todos/:id': 'Supprimer un todo',
      'GET /health': 'Status de l\'API'
    },
    version: '1.0.0'
  });
});

// GET /todos
app.get('/todos', (req, res) => {
  res.json({
    count: todos.length,
    todos
  });
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo non trouvé' });
  }

  res.json(todo);
});

// POST /todos
app.post('/todos', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Le titre est requis' });
  }

  const newTodo = {
    id: nextId++,
    title: title.trim(),
    completed: false
  };

  todos.push(newTodo);

  res.status(201).json({
    message: 'Todo créé',
    todo: newTodo
  });
});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo non trouvé' });
  }

  if (title !== undefined) todo.title = title.trim();
  if (completed !== undefined) todo.completed = completed;

  res.json({
    message: 'Todo mis à jour',
    todo
  });
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo non trouvé' });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

// GET /health
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    todos_count: todos.length
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

module.exports = app;
