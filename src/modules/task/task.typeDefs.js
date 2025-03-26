const { gql } = require('graphql-tag');

const taskTypeDefs = gql`
    scalar DateTime

    input CreateTaskInput {
        title: String!
        description: String
        deadline: DateTime
        image: String
    }

    type Task {
        id: ID!
        title: String!
        description: String
        image: String
        deadline: DateTime
        createdAt: DateTime!
    }

    type Mutation {
        createTask(input: CreateTaskInput!): Task!
    }
`;

module.exports = taskTypeDefs;