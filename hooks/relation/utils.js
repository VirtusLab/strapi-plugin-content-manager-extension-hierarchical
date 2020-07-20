const getIdFromParentAndChild =  (obj, relationName, idsContainter) => {
  let ids = [];
  let idsToCompare = [...idsContainter];
  if(idsToCompare.includes(obj.id)) {
    ids.push(obj.id)
    return ids;
  }
  ids.push(obj.id);
  if(obj.child) {
    ids.push(...getIdFromParentAndChild(obj.child, relationName, ids));
  }
  if(obj[relationName] && obj[relationName].id === obj.id){
    ids.push(obj.id)
  }
  return ids;
}

const collectIdsFromNestedData = (nestedData, relationName) => {
  let ids = [];
  nestedData.forEach(el => {
    ids = [...ids, ...getIdFromParentAndChild(el, relationName, ids)]
  });
  return ids;
}

const createRelationStructure = (data, relationName) => {
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
}

const prepareNewStructure = (childId, parentId,  data, relationName) => {
  let parentToChangeAChild = data.find(el => el.id == parentId);
  const newChild = childId == -1 ? null : data.find(el => el.id == childId);
  parentToChangeAChild[relationName] = newChild;
  const updatedData  = data.map(el => el.id == parentId ? parentToChangeAChild : el);
  return createRelationStructure(updatedData, relationName)
}

const isRelationStructureCorrect = (data, relationStructure, relationName) => {
  const idsFromNestedData = collectIdsFromNestedData(relationStructure, relationName);
  return idsFromNestedData.length === data.length;
}

const findRowsToHighlight = (relationStructure, relationName, data) => {
  let rows = [];
  const idsFromNestedData = collectIdsFromNestedData(relationStructure, relationName);
  const initialIds = data.map(dataEl => dataEl.id);
  initialIds.forEach(id => {
    if(!idsFromNestedData.includes(id)){
      rows.push(id);
    }
  })
  const duplicatedIds = idsFromNestedData.filter((e, i, a) => a.indexOf(e) !== i);
  duplicatedIds.forEach(id => {
    const parents = data.filter(dataEl => {
      if(dataEl[relationName]) {
        return dataEl[relationName].id === id;
      }
    })
    parents.forEach(parent => {
      if (parent.id) {
        rows.push(parent.id)
      }
    })
  })
  return rows;
}

module.exports = {
  getIdFromParentAndChild,
  collectIdsFromNestedData,
  createRelationStructure,
  prepareNewStructure,
  isRelationStructureCorrect,
  findRowsToHighlight
}
