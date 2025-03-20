const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });
const dbConnection = require('./DB/database');
const formatError = require('./src/middlewares/formatError');
const authMiddleware = require('./src/middlewares/authMiddleware');

const { testTypeDefs, testResolvers } = require('./src/modules/test/index');
const { authTypeDefs, authResolvers } = require('./src/modules/auth/index');


const server = new ApolloServer({
    typeDefs: [testTypeDefs, authTypeDefs],
    resolvers: [testResolvers, authResolvers],
    formatError,
});


const app = express();
const port = process.env.PORT || 3000;

(async () => {
    await dbConnection();
    await server.start();

    //Middleware
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req, res }) => {
            const user = await authMiddleware({ req }).catch(() => null);
            return { 
                req, 
                res, 
                userId: user ? user.userId : null
            };
        }
    }));

    app.listen(port, () => {
        console.log(`Server ready at http://localhost:${port}/graphql`);
      });
})();





