const { gql } = require('graphql-tag');

const userTypeDefs = gql`
    scalar DateTime

    input CreateUserInput {
        name: String!
        email: String!
        password: String!
        passwordConfirm: String!
        role: String
    }

    input PaginationInput {
        page: Int
        limit: Int
    }

    input SearchInput {
        keyword: String
    }

    input FilterInput {
        name: String
        email: String
        role: String
        createdAt: String
    }

    type User {
        id: ID!
        name: String!
        email: String!
        role: String!
        createdAt: DateTime!
    }

    type PaginationResult {
        currentPage: Int
        limit: Int
        count: Int
        totalPages: Int
        nextPage: Int
        prevPage: Int
    }

    type GetUsersResponse {
        success: Boolean!
        pagination: PaginationResult
        data: [User!]!
    }
    
    type Mutation {
        createUser(input: CreateUserInput): User!
    }

    type Query {
        getUser(userId: ID!): User!
        getUsers(
            pagination: PaginationInput
            search: SearchInput
            filter: FilterInput
            sort: String
            fields: String   
        ) : GetUsersResponse!
    }
`;

module.exports = userTypeDefs;