const { gql } = require('graphql-tag');

const taskTypeDefs = gql`
    scalar DateTime
    scalar Upload

    input CreateTaskInput {
        title: String!
        description: String
        deadline: DateTime
        image: Upload
        labels: [ID!]
    }

    input UpdateTaskInput {
        taskId: ID!
        title: String
        description: String
        deadline: DateTime
        image: Upload
        taskStatus: String
        labels: [ID!]
    }

    input DeleteTaskInput {
        taskId: ID!
    }

    input GetTaskInput {
        taskId: ID!
    }

    input PaginationInput {
        page: Int
        limit: Int
    }

    input SearchInput { 
        keyword: String
    }

    input FilterInput {
        title: String
        description: String
        taskStatus: String
        deadline: DateTime
        createdAt: DateTime
    }

    type User {
        id: ID!
        name: String!
    }

    type Label {
    id: ID!
    name: String!
    color: String!
    }

    type Task {
        id: ID!
        title: String!
        description: String
        image: String   
        taskStatus: String
        deadline: DateTime
        createdAt: DateTime!
        createdBy: User
        labels: [Label!]!
    }

    type PaginationResult {
        currentPage: Int
        limit: Int
        count: Int
        totalPages: Int
        nextPage: Int
        prevPage: Int
    }

    type GetTasksResponse {
        source: String!
        success: Boolean!
        pagination: PaginationResult
        data: [Task!]!
    }

    type GetTaskResponse {
        source: String!
        data: Task!
    }

    type Mutation {
        createTask(input: CreateTaskInput!): Task!
        updateTask(input: UpdateTaskInput!): Task!
        deleteTask(input: DeleteTaskInput!): String!
    }

    type Query {
        getTasks(
            pagination: PaginationInput
            search: SearchInput
            filter: FilterInput
            sort: String
            fields: String
        ): GetTasksResponse!
        getTask(input: GetTaskInput!): GetTaskResponse!
    }
`;

module.exports = taskTypeDefs;