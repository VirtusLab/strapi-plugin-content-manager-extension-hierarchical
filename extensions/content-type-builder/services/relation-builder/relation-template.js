const { sanitizeEntity } = require('strapi-utils');

const  createRelation = async(ctx) => {
  const { relationName } = ctx.params; 
  let data;
  if (ctx.query._q) {
    data = await strapi.services.placeholder.search(ctx.query);
  } else {
    data  = await strapi.services.placeholder.find(ctx.query);
  }

  const relationStructure = strapi.services.relation.createRelationStructure(data, relationName);

  return {
    relationStructure:  relationStructure,
    isStructureCorrect: strapi.services.relation.isRelationStructureCorrect(data, relationStructure, relationName),
    rowsToHighlight: strapi.services.relation.findRowsToHighlight(relationStructure, relationName, data),
  }
}

const validateRelation = async(ctx) => {
  const {relationName, parentId, childId} = ctx.params;
  let data;
  if (ctx.query._q) {
    data = await strapi.services.placeholder.search(ctx.query);
  } else {
    data  = await strapi.services.placeholder.find(ctx.query);
  }

  if(parentId === 'create') {
    return ({isCorrect: true})
  }

  const relationStructure = strapi.services.relation.prepareNewStructure(childId, parentId, data, relationName);
  return ({isCorrect: strapi.services.relation.isRelationStructureCorrect(data, relationStructure, relationName)})
}

module.exports = {
  createRelation,
  validateRelation
}

