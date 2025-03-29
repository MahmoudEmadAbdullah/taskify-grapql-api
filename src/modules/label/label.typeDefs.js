const { gql } = require('graphql-tag');

const labelTypeDefs = gql`
    scalar DateTime

    input CreateLabelInput {
        name: String!
        color: String
    }

    input UpdateLabelInput {
        labelId: ID!
        name: String
        color: String
    }

    input DeleteLabelInput {
        labelId: ID!
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
        color: String
        createdAt: DateTime
    }

    type Label {
        id: ID!
        name: String!
        color: String!
        createdAt: DateTime!
        createdBy: ID!
    }

    type PaginationResult {
        currentPage: Int
        limit: Int
        count: Int
        totalPages: Int
        nextPage: Int
        prevPage: Int
    }

    type GetLabelsResponse {
        source: String!
        success: Boolean!
        pagination: PaginationResult
        data: [Label!]!
    }

    type Mutation {
        createLabel(input: CreateLabelInput!): Label!
        updateLabel(input: UpdateLabelInput!): Label!
        deleteLabel(input: DeleteLabelInput!): String!
    }

    type Query {
        getLabels(
            pagination: PaginationInput
            search: SearchInput
            filter: FilterInput
            sort: String
            fields: String
        ): GetLabelsResponse!
    }
`;

module.exports = labelTypeDefs;
