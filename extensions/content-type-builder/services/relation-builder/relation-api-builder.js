'use strict';

const fs = require('fs-extra');
const { generateRelationControllerContent } = require('./relation-controller-builder.js');
const _ = require('lodash');

const relationApiBuilder = async (contentType) => {
  const routesPath = `./api/${contentType.name}/config/routes.json`;
  let ApiContent;
  try {
    ApiContent =  JSON.parse(fs.readFileSync(routesPath, 'utf8'));
  } catch (err) {
    console.error(err)
  }
  const rootPath = _.get(ApiContent, ['routes', '0', 'path']);
  ApiContent.routes = [
    {
      "method": "GET",
      "path": `/content-manager${rootPath}/relation/:relationName`,
      "handler": "Relation.createRelation",
      "config": {
        "policies": []
      }
    },
    ...ApiContent.routes
  ]
  try {
    await fs.writeFileSync(routesPath, JSON.stringify(ApiContent));
    console.log(`relation route for ${contentType.name} created`)
  } catch (err) {
    console.error(err)
  }
  generateRelationControllerContent(contentType.name);

}

module.exports = {
  relationApiBuilder,
}
