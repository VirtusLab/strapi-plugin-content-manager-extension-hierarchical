const {
  getIdFromParentAndChild,
  collectIdsFromNestedData,
  createRelationStructure,
  prepareNewStructure,
  isRelationStructureCorrect,
  findRowsToHighlight
} = require("../../hooks/relation/utils");

describe("getIdFromParentAndChild", () => {
  it("should return [1,2] for dual nested data and fakeRelationName", () => {
    expect(
      getIdFromParentAndChild(
        {
          id: 1,
          fakeRelationName: {
            id: 2
          },
          child: {
            id: 2
          }
        },
        "fakeRelationName",
        []
      ).sort()
    ).toEqual([1, 2]);
  });

  it("should return [1,1] for single nested data and fakeRelationName ", () => {
    expect(
      getIdFromParentAndChild(
        {
          id: 1,
          fakeRelationName: {
            id: 1
          }
        },
        "fakeRelationName",
        []
      )
    ).toEqual([1, 1]);
  });

  it("should return [1] for not nested data and fakeRelationName", () => {
    expect(
      getIdFromParentAndChild(
        {
          id: 1,
          fakeRelationName1: {
            id: 1
          }
        },
        "fakeRelationName",
        []
      )
    ).toEqual([1]);
  });

  it("should not return [1,2] for not nested data and fakeRelationName", () => {
    expect(
      getIdFromParentAndChild(
        {
          id: 1,
          fakeRelationName1: {
            id: 1
          }
        },
        "fakeRelationName",
        []
      )
    ).not.toEqual([1, 2]);
  });
});

describe("collectIdsFromNestedData", () => {
  it("should return empty array for empty data and fakeRelationName", () => {
    expect(collectIdsFromNestedData([], "fakeRelationName")).toEqual([]);
  });

  it("should return [1,2,2,2] for single nested data and fakeRelationName", () => {
    expect(
      collectIdsFromNestedData(
        [
          {
            id: 1,
            child: {
              id: 2
            },
            fakeRelationName: {
              id: 2
            }
          },
          {
            id: 2,
            fakeRelationName: null
          }
        ],
        "fakeRelationName"
      )
    ).toEqual([1, 2, 2]);
  });

  it("should return [1,2,3] for double neested data and fakeRelationName", () => {
    expect(
      collectIdsFromNestedData(
        [
          {
            id: 1,
            child: {
              id: 2,
              fakeRelationName: {
                id: 3
              },
              child: {
                id: 3,
                fakeRelationName: null
              }
            },
            fakeRelationName: {
              id: 2
            }
          }
        ],
        "fakeRelationName"
      )
    ).toEqual([1, 2, 3]);
  });

  it("should not return [1,2,3,4] for double neested data and fakeRelationName", () => {
    expect(
      collectIdsFromNestedData(
        [
          {
            id: 1,
            child: {
              id: 2,
              fakeRelationName: {
                id: 3
              },
              child: {
                id: 3,
                fakeRelationName: null
              }
            },
            fakeRelationName: {
              id: 2
            }
          }
        ],
        "fakeRelationName"
      )
    ).not.toEqual([1, 2, 3, 4]);
  });
});

describe("createRelationStructure", () => {
  it("should return empty array for empty array and fakeRelationName", () => {
    expect(createRelationStructure([], "fakeRelationName")).toEqual([]);
  });

  it("should return single object for single nested data", () => {
    expect(
      createRelationStructure(
        [
          {
            id: 1,
            fakeRelationName: {
              id: 2
            }
          },
          {
            id: 2,
            fakeRelationName: null
          }
        ],
        "fakeRelationName"
      )
    ).toEqual([
      {
        id: 1,
        child: {
          id: 2,
          fakeRelationName: null,
          isChild: true
        },
        fakeRelationName: {
          id: 2
        }
      }
    ]);
  });

  it("for data without relation property should return the same data", () => {
    expect(
      createRelationStructure(
        [
          {
            id: 1,
            fakeRelationName: {
              id: 2
            }
          },
          {
            id: 2,
            fakeRelationName: null
          }
        ],
        "fakeRelationName1"
      )
    ).toEqual([
      {
        id: 1,
        fakeRelationName: {
          id: 2
        }
      },
      {
        id: 2,
        fakeRelationName: null
      }
    ]);
  });

  it("should not return single object for single nested data", () => {
    expect(
      createRelationStructure(
        [
          {
            id: 1,
            fakeRelationName: {
              id: 2
            }
          },
          {
            id: 2,
            fakeRelationName: null
          }
        ],
        "fakeRelationName"
      )
    ).not.toEqual([
      {
        id: 1,
        child: {
          id: 2,
          fakeRelationName: null,
          isChild: true
        },
        fakeRelationName: {
          id: 3
        }
      }
    ]);
  });
});

describe("prepareNewStructure", () => {
  it("should change property 'relationName' of object with id 1 to object with id 2", () => {
    expect(
      prepareNewStructure(
        2,
        1,
        [
          {
            id: 1,
            relationName: null
          },
          {
            id: 2,
            relationName: null
          }
        ],
        "relationName"
      )
    ).toEqual([
      {
        id: 1,
        relationName: {
          id: 2,
          relationName: null
        },
        child: {
          id: 2,
          isChild: true,
          relationName: null
        }
      }
    ]);
  });

  it("should change property 'relationName' of object with id 1 from object with id 2 to null", () => {
    expect(
      prepareNewStructure(
        -1,
        1,
        [
          {
            id: 1,
            relationName: {
              id: 2,
              relationName: null
            }
          },
          {
            id: 2,
            relationName: null
          }
        ],
        "relationName"
      )
    ).toEqual([
      {
        id: 1,
        relationName: null
      },
      {
        id: 2,
        relationName: null
      }
    ]);
  });

  it("should not change property 'relationName' of object with id 1 from object with id 2 to null", () => {
    expect(
      prepareNewStructure(
        -1,
        1,
        [
          {
            id: 1,
            relationName: {
              id: 2,
              relationName: null
            }
          },
          {
            id: 2,
            relationName: null
          }
        ],
        "relationName"
      )
    ).not.toEqual([
      {
        id: 1,
        relationName: null
      },
      {
        id: 2,
        relationName: 1
      }
    ]);
  });
});

describe("isRelationStructureCorrect", () => {
  it("should return false because parent is child for itself", () => {
    expect(
      isRelationStructureCorrect(
        [
          {
            id: 1,
            relationName: {
              id: 1
            }
          }
        ],
        [
          {
            id: 1,
            relationName: {
              id: 1
            }
          }
        ],
        "relationName"
      )
    ).toEqual(false);
  });

  it("should return true because relationName1 doesnt exist", () => {
    expect(
      isRelationStructureCorrect(
        [
          {
            id: 1,
            relationName: {
              id: 1
            }
          }
        ],
        [
          {
            id: 1,
            relationName: {
              id: 1
            }
          }
        ],
        "relationName1"
      )
    ).toEqual(true);
  });

  it("should return true because relation is proper", () => {
    expect(
      isRelationStructureCorrect(
        [
          {
            id: 1,
            relationName: {
              id: 2
            }
          },
          {
            id: 2,
            relationName: null
          }
        ],
        [
          {
            id: 1,
            relationName: {
              id: 2,
              relationName: null
            },
            child: {
              id: 2,
              isChild: true,
              relationName: null
            }
          }
        ],
        "relationName"
      )
    ).toEqual(true);
  });

  it("should not return false", () => {
    expect(
      isRelationStructureCorrect(
        [
          {
            id: 1,
            relationName: {
              id: 2
            }
          },
          {
            id: 2,
            relationName: null
          }
        ],
        [
          {
            id: 1,
            relationName: {
              id: 2,
              relationName: null
            },
            child: {
              id: 2,
              isChild: true,
              relationName: null
            }
          }
        ],
        "relationName"
      )
    ).not.toEqual(false);
  });
});

describe("findRowsToHighlight", () => {
  it("should return array with 1 for not nested data with id = 1", () => {
    expect(
      findRowsToHighlight(
        [
          {
            id: 1,
            relationName: {
              id: 1
            }
          }
        ],
        "relationName",
        [
          {
            id: 1,
            relationName: {
              id: 1
            }
          }
        ]
      )
    ).toEqual([1]);
  });

  it("should return empty array for empty data", () => {
    expect(findRowsToHighlight([], "", [])).toEqual([]);
  });

  it("should return all elements id for single nested data with wrong relation", () => {
    expect(
      findRowsToHighlight([], "relationName", [
        {
          id: 1,
          relationName: {
            id: 2
          }
        },
        {
          id: 2,
          relationName: {
            id: 3
          }
        },
        {
          id: 3,
          relationName: {
            id: 1
          }
        }
      ])
    ).toEqual([1, 2, 3]);
  });

  it("should not return [1] for empty data", () => {
    expect(findRowsToHighlight([], "", [])).not.toEqual([1]);
  });
});
