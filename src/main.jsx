import ReactDOM from 'react-dom/client';
import App from './App';

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, 
  split, createHttpLink 
 } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';

// Configura el link de error
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, location, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${location}, Path: ${path}`);
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// Autenticación: Añadir el token en los encabezados
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('user-token');
  console.log('Authorization Token:', token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  };
});

// Configuración de WebSocketLink para suscripciones
const wsLink = new WebSocketLink({
  uri: `wss://jaoreactgraphql.onrender.com/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => {
      const token = localStorage.getItem('user-token');
      return {
        authorization: token ? `Bearer ${token}` : null,
      };
    },
  },
});

/* const wsLink = new WebSocketLink({
  //uri: `ws://localhost:4000/graphql`,  // Usar `wss://` para producción con HTTPS https://jaoreactgraphql.onrender.com
  uri: `wss://jaoreactgraphql.onrender.com/graphql`,
  options: {
    reconnect: true,
  },
}); */

// Configuración de HTTPLink
const httpLink = createHttpLink({
  //uri: 'http://localhost:4000/graphql',  
  uri: 'https://jaoreactgraphql.onrender.com/graphql',   
}); 

// Usar 'split' para redirigir las suscripciones al WebSocketLink y las demás operaciones al HTTPLink
const splitLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,  // Enviar suscripciones a WebSocket
  authLink.concat(httpLink)  // Enviar todo lo demás a HTTP
);

// Crear el cliente de Apollo con la configuración de enlaces
const client = new ApolloClient({
  cache: new InMemoryCache(),  // Usar caché de Apollo
  link: errorLink.concat(httpLink),  // Usar splitLink para manejar las suscripciones y las operaciones HTTP
}); 


// Renderizar el componente React con ApolloProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
