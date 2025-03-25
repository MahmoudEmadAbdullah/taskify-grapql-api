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

    input UpdateUserInput {
        userId: ID!
        name: String
        email: String
        role: String
    }

    input ChangeUserPasswordInput {
        userId: ID!
        newPassword: String!
        newPasswordConfirm: String!
    }

    input UpdateMeInput {
        name: String
        email: String
    }

    input ChangeMyPasswordInput {
        currentPassword: String!
        newPassword: String!
        newPasswordConfirm: String!
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
        createdAt: DateTime
    }
    
    type User {
        id: ID!
        name: String!
        email: String
        role: String!
        createdAt: DateTime!
    }

    type ChangeMyPasswordResponse {
        success: Boolean!
        accessToken: String!
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
        source: String!
        success: Boolean!
        pagination: PaginationResult
        data: [User!]!
    }

    type UserResponse {
        source: String!
        data: User!
    }
    
    type Mutation {
        createUser(input: CreateUserInput!): User!
        updateUser(input: UpdateUserInput!): User!
        changeUserPassword(input: ChangeUserPasswordInput!): User!
        deleteUser(userId: ID!): User!
        updateMe(input: UpdateMeInput!): User!
        changeMyPassword(input: ChangeMyPasswordInput!): ChangeMyPasswordResponse!
        deleteMe: String!
    }

    type Query {
        getUser(userId: ID!): UserResponse!
        getUsers(
            pagination: PaginationInput
            search: SearchInput
            filter: FilterInput
            sort: String
            fields: String   
        ) : GetUsersResponse!
        getMe: UserResponse!
    }
`;

module.exports = userTypeDefs;