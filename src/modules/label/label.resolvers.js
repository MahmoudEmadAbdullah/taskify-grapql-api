const { DateTimeResolver } = require('graphql-scalars');
const labelController = require('./controller/labelController')
const validate = require('../../middlewares/validate');
const { AuthenticationError } = require('../../utils/errors');
const {
    createLabelSchema,
    updateLabelSchema,
    deleteLabelSchema
} = require('./label.validation');


const labelResolvers = {
    DateTime: DateTimeResolver,

    Mutation: {
        createLabel: validate(createLabelSchema)(async (_, { input }, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized');
            }
            return labelController.createLabel(input,context);
        }),
        updateLabel: validate(updateLabelSchema)(async (_, { input }, context) => {
            return labelController.updateLabel(input, context);
        }),
        deleteLabel: validate(deleteLabelSchema)(async (_, { input }, context) => {
            return labelController.deleteLabel(input, context);
        })
    },

    Query: {
        getLabels: async (_, args, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized');
            }
            return labelController.getLabels(args, context);
        }
    }
};

module.exports = labelResolvers;