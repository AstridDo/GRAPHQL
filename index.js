var express = require('express');
var { graphqlHTTP } = require('express-graphql'); // Actualización aquí
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Cliente {
    id: Int
    nombre: String
    telefono: String
  }

  type Query {
    clientes: [Cliente]
    cliente(id: Int): Cliente
  }

  type Mutation {
    addCliente(nombre: String, telefono: String): Cliente
  }
`);

var clientes = [];
var counter = 1;

// Función para resolver las peticiones
var root = {
  clientes: () => { return clientes; },

  cliente: (data) => { 
    for (var i = 0; i < clientes.length; i++) 
      if (clientes[i].id == data.id) 
        return clientes[i]; 
    return null; 
  },

  addCliente: (data) => { 
    var c = { 'id': counter, 'nombre': data.nombre, 'telefono': data.telefono }; 
    clientes.push(c); 
    counter++; 
    return c; 
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('GraphQL API en http://localhost:4000/graphql');
