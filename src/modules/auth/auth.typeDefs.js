const { gql } = require('graphql-tag');

const authTypeDefs = gql`
    input SignupInput {
        name: String!
        email: String!
        password: String!
    }

    input VerifyEmailInput {
        verficationCode: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    type AuthPayload {
        accessToken: String!
        user: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
    }

    type RefreshTokenPayload {
        accessToken: String!
    }

    input ForgotPasswordInput {
        email: String!
    }

    input VerifyResetCodeInput {
        resetCode: String!
    }

    input ResetPasswordInput {
        email: String!
        newPassword: String!
    }

    type ResetPasswordPayload {
        accessToken: String!
    }

    type Mutation {
        signup(input: SignupInput): String!
        verifyEmail(input: VerifyEmailInput): String!
        login(input: LoginInput): AuthPayload
        refreshToken: RefreshTokenPayload
        logout: Boolean!
        forgotPassword(input: ForgotPasswordInput): String!
        verifyResetCode(input: VerifyResetCodeInput): String!
        resetPassword(input: ResetPasswordInput): ResetPasswordPayload
    }
`;

module.exports = authTypeDefs;