const { gql } = require('graphql-tag');

const testTypeDefs = gql`
    type Query {
        test: String
    }
`;

module.exports = testTypeDefs;