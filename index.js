const express = require('express');//micro framework do node

const server = express(); //variavel para receber funcao do express

// server.get cria a requisicao getquando acessarem localhost:3000/teste

//informa ao express que ele tem que ler JSON no corpo das msgs POST
server.use(express.json());

//CRUD 


//criar vetor de usuarios
const users = ['user1','user2','user3'];

//cria um middleware global para chamar outras rotas
//tem que ser inserido antes dos outros metodos
server.use((req, res, next)=>{
  console.time('Request');
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);

  //return next();
  next();

  console.timeEnd('Request');
})

//funcao vericifa se o nome esta no corpo da msg
//inserir nos metodos POST e PUT o checkUserExists
function checkUserExists(req, res, next){
  if(!req.body.name){
    return res.status(400).json({ error: 'User name is required'});
  }
  return next();
}

//funcao para verificar se o usuario existe
function checkUserInArray(req, res, next){
  const user = users[req.params.index];

  if(!user){
    return res.status(400).json({ error: 'User does not exist'});
  }

  req.user = user;

  return next();
}



//retorna todos os usuarios
server.get('/users',(req, res)=>{
  return res.json(users);
})


//digitando no navegador http://localhost:3030/users/3 onde 3 e o numero do user
server.get('/users/:index',checkUserInArray, (req, res)=>{

  //recebe o parametro nome inserido na URL via route params
  //const id = req.params.id;
  // ou const {id} = req.params;
  //recebe o parametro nome inserido na URL via query params 
  //const nome = req.query.nome;

  //informa o que retornar ao cliente nesse caso no navegador
  //vai aparecer Hello word
  //return res.send('Hello word');
  //json para enviar msg estruturada em json
  //return res.json({message: `Buscando usuario: ${id}`});
  const {index} = req.params;
  return res.json(req.user);
})

//cria uma rota POST para incluir um usuario na base de dados
server.post('/users',checkUserExists, (req, res)=>{
  //busca a variavel name do corpo da requisicao
  const {name} = req.body;
  users.push(name);
  
  return res.json(users);//sempre tem que retornar algo ou fica carregando eterno no navegador
})


//cria rota para editar usuario
server.put('/users/:index',checkUserExists,checkUserInArray, (req, res)=>{
  const {index} = req.params;//busca o index do usuario no vetor
  const {name} = req.body;//busca o nome no corpo da msg POST
  users[index] = name; //inclui o nome no endereco do usuario index
  return res.json(users);
})

//cria rota para deletar usuario
server.delete('/users/:index',checkUserInArray, (req, res)=>{
  const {index} = req.params;//busca o index do usuario no vetor
  users.splice(index, 1);// faz realizar busca ate o indice informado e remover item
  return res.json(users);
})





//coloca o servidor para escutar na porta 3030
server.listen(3030);


