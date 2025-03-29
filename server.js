const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { graphqlUploadExpress } = require('graphql-upload-minimal');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });
const dbConnection = require('./DB/database');
const formatError = require('./src/middlewares/formatError');
const authMiddleware = require('./src/middlewares/authMiddleware');
const { connectRedis } = require('./src/config/redisConfig');

const { authTypeDefs, authResolvers } = require('./src/modules/auth/index');
const { userTypeDefs, userResolvers } = require('./src/modules/user/index');
const { taskTypeDefs, taskResolvers } = require('./src/modules/task/index');
const { labelTypeDefs, labelResolvers } = require('./src/modules/label/index');

const server = new ApolloServer({
    typeDefs: [ authTypeDefs, userTypeDefs, taskTypeDefs, labelTypeDefs ],
    resolvers: [ authResolvers, userResolvers, taskResolvers, labelResolvers ],
    formatError,
    csrfPrevention: false, 
});

const app = express();
const port = process.env.PORT || 3000;

(async () => {
    await dbConnection();
    await connectRedis();
    await server.start();

    //Middleware
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(morgan("dev"));
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req, res }) => {
            const user = await authMiddleware({ req }).catch(() => null);
            return { 
                req, 
                res, 
                userId: user ? user.userId : null,
                role: user ? user.role : null
            };
        }
    }));

    app.listen(port, () => {
        console.log(`Server ready at http://localhost:${port}/graphql`);
      });
})();





