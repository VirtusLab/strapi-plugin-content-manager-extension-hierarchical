const {
  prepareNewStructure,
  findRowsToHighlight,
  createRelationStructure,
  isRelationStructureCorrect
} = require('./utils')

module.exports = strapi => {
  return {
    async initialize() {

      strapi.services.relation = {

        createRelationStructure,

        prepareNewStructure,

        isRelationStructureCorrect,

        findRowsToHighlight
      };
    },
  };
};
