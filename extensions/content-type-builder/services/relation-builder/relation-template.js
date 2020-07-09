const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async createRelation(ctx) {
    const { relationName } = ctx.params; 
    let data;
    if (ctx.query._q) {
      data = await strapi.services.placeholder.search(ctx.query);
    } else {
      data  = await strapi.services.placeholder.find(ctx.query);
    }
    const copiedData = data.map(el => ({ ...el }));
    copiedData.forEach(el => {
      let parents = copiedData.filter(x => {
        if(x[relationName]) {
          return x[relationName].id === el.id
        } else {
          return false
        }
      })
      if(parents.length) {
        parents.forEach( parent => {
          if(parent.id !== el.id) {
            parent.child = el;
            el.isChild = true;
          }
        })
      }
    })
    return copiedData.filter(el => !el.isChild)
  },
};

