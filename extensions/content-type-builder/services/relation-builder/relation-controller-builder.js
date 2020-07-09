'use strict';

const fs = require('fs-extra');

const generateRelationControllerContent = (name) => {
  fs.readFile('extensions/content-type-builder/services/relation-builder/relation-template.js', 'utf-8', function(err, data){
    if (err) throw err;

    var newValue = data.replace(/placeholder/g, `${name}`);

    fs.writeFile(`./api/${name}/controllers/Relation.js`, newValue, 'utf-8', function (err) {
      if (err) throw err;
      console.log('filelistAsync complete');
    });
  });
}

module.exports = {
  generateRelationControllerContent,
}

