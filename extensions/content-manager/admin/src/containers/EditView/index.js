import React, { memo, useCallback, useMemo, useEffect, useReducer, useRef, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { BackHeader, LiLink, request } from 'strapi-helper-plugin';
import pluginId from '../../pluginId';
import Container from '../../components/Container';
import DynamicZone from '../../components/DynamicZone';
import FormWrapper from '../../components/FormWrapper';
import FieldComponent from '../../components/FieldComponent';
import Inputs from '../../components/Inputs';
import SelectWrapper from '../../components/SelectWrapper';
import getInjectedComponents from '../../utils/getComponents';
import EditViewDataManagerProvider from '../EditViewDataManagerProvider';
import EditViewProvider from '../EditViewProvider';
import Header from './Header';
import createAttributesLayout from './utils/createAttributesLayout';
import { LinkWrapper, SubWrapper } from './components';
import init from './init';
import reducer, { initialState } from './reducer';
import { FormattedMessage } from 'react-intl';
/* eslint-disable  react/no-array-index-key */

const EditView = ({ components, currentEnvironment, deleteLayout, layouts, plugins, slug }) => {

  const { search, pathname } = useLocation();
  const [selectedOption, setSelectedOption] = useState({});
  const [fetchingStructureCorrectness, setFetchingStructureCorrectness] = useState(false);
  const [isStructureCorrect, setIsStructureCorrect] = useState(true);
  const collectionName = get(layouts, [slug, 'contentType', 'schema', 'collectionName']);
  const currentContentTypeId = pathname.substring(pathname.lastIndexOf('/') + 1);
  const isRelationViewEnabled = get(layouts, [slug, 'contentType', 'settings', 'relation']);
  const selectedRelationName = get(layouts, [slug, 'contentType', 'settings', 'relationName']);

  const getStructureCorrectness = async (collectionName, relationName, parentId, childId) => {
    setFetchingStructureCorrectness(true);
    try {
      const structureCorrectness = await request(`/content-manager/${collectionName}/validateRelation/${relationName}/${parentId}/${childId}`, {
        method: 'GET',
      });
      setIsStructureCorrect(structureCorrectness.isCorrect);
      setFetchingStructureCorrectness(false);
    } catch (err) {
      strapi.notification.error(`content-manager.error.relation.fetch`);
    }
  };

  useEffect(() => {
    if(isRelationViewEnabled !== undefined &&  !_.isEmpty(selectedOption)){
      getStructureCorrectness(collectionName, selectedRelationName, currentContentTypeId, selectedOption.id)
    } else if(isRelationViewEnabled !== undefined) {
      getStructureCorrectness(collectionName, selectedRelationName, currentContentTypeId, -1)
    }
  }, [selectedOption])

  const formatLayoutRef = useRef();
  formatLayoutRef.current = createAttributesLayout;
  // Retrieve push to programmatically navigate between views
  const { push } = useHistory();
  // Retrieve the search and the pathname
  const {
    params: { contentType },
  } = useRouteMatch('/plugins/content-manager/:contentType');
  const isSingleType = contentType === 'singleType';
  const [reducerState, dispatch] = useReducer(reducer, initialState, () => init(initialState));
  const allLayoutData = useMemo(() => get(layouts, [slug], {}), [layouts, slug]);
  const currentContentTypeLayoutData = useMemo(() => get(allLayoutData, ['contentType'], {}), [
    allLayoutData,
  ]);
  const currentContentTypeLayout = useMemo(
    () => get(currentContentTypeLayoutData, ['layouts', 'edit'], []),
    [currentContentTypeLayoutData]
  );
  const currentContentTypeLayoutRelations = useMemo(
    () => get(currentContentTypeLayoutData, ['layouts', 'editRelations'], []),
    [currentContentTypeLayoutData]
  );
  const currentContentTypeSchema = useMemo(
    () => get(currentContentTypeLayoutData, ['schema'], {}),
    [currentContentTypeLayoutData]
  );

  const getFieldMetas = useCallback(
    fieldName => {
      return get(currentContentTypeLayoutData, ['metadatas', fieldName, 'edit'], {});
    },
    [currentContentTypeLayoutData]
  );
  const getField = useCallback(
    fieldName => {
      return get(currentContentTypeSchema, ['attributes', fieldName], {});
    },
    [currentContentTypeSchema]
  );
  const getFieldType = useCallback(
    fieldName => {
      return get(getField(fieldName), ['type'], '');
    },
    [getField]
  );
  const getFieldComponentUid = useCallback(
    fieldName => {
      return get(getField(fieldName), ['component'], '');
    },
    [getField]
  );

  // Check if a block is a dynamic zone
  const isDynamicZone = useCallback(
    block => {
      return block.every(subBlock => {
        return subBlock.every(obj => getFieldType(obj.name) === 'dynamiczone');
      });
    },
    [getFieldType]
  );

  useEffect(() => {
    // Force state to be cleared when navigation from one entry to another
    dispatch({ type: 'RESET_PROPS' });
    dispatch({
      type: 'SET_LAYOUT_DATA',
      formattedContentTypeLayout: formatLayoutRef.current(
        currentContentTypeLayout,
        currentContentTypeSchema.attributes
      ),
    });

    return () => deleteLayout(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContentTypeLayout, currentContentTypeSchema.attributes]);

  const { formattedContentTypeLayout, isDraggingComponent } = reducerState.toJS();

  // We can't use the getQueryParameters helper here because the search
  // can contain 'redirectUrl' several times since we can navigate between documents
  const redirectURL = search
    .split('redirectUrl=')
    .filter((_, index) => index !== 0)
    .join('redirectUrl=');

  const redirectToPreviousPage = () => push(redirectURL);

  return (
    <EditViewProvider
      allLayoutData={allLayoutData}
      components={components}
      layout={currentContentTypeLayoutData}
      isDraggingComponent={isDraggingComponent}
      setIsDraggingComponent={() => {
        dispatch({
          type: 'SET_IS_DRAGGING_COMPONENT',
        });
      }}
      unsetIsDraggingComponent={() => {
        dispatch({
          type: 'UNSET_IS_DRAGGING_COMPONENT',
        });
      }}
    >
      <EditViewDataManagerProvider
        allLayoutData={allLayoutData}
        redirectToPreviousPage={redirectToPreviousPage}
        slug={slug}
      >
        <BackHeader onClick={redirectToPreviousPage} />
        <Container className="container-fluid">
          <Header />
          <div className="row" style={{ paddingTop: 3 }}>
            <div className="col-md-12 col-lg-9" style={{ marginBottom: 13 }}>
              {formattedContentTypeLayout.map((block, blockIndex) => {
                if (isDynamicZone(block)) {
                  const {
                    0: {
                      0: { name },
                    },
                  } = block;
                  const { max, min } = getField(name);

                  return <DynamicZone key={blockIndex} name={name} max={max} min={min} />;
                }

                return (
                  <FormWrapper key={blockIndex}>
                    {block.map((fieldsBlock, fieldsBlockIndex) => {
                      return (
                        <div className="row" key={fieldsBlockIndex}>
                          {fieldsBlock.map(({ name, size }, fieldIndex) => {
                            const isComponent = getFieldType(name) === 'component';

                            if (isComponent) {
                              const componentUid = getFieldComponentUid(name);
                              const isRepeatable = get(getField(name), 'repeatable', false);
                              const { max, min } = getField(name);

                              const label = get(getFieldMetas(name), 'label', componentUid);

                              return (
                                <FieldComponent
                                  key={componentUid}
                                  componentUid={componentUid}
                                  isRepeatable={isRepeatable}
                                  label={label}
                                  max={max}
                                  min={min}
                                  name={name}
                                />
                              );
                            }

                            return (
                              <div className={`col-${size}`} key={name}>
                                <Inputs
                                  autoFocus={
                                    blockIndex === 0 && fieldsBlockIndex === 0 && fieldIndex === 0
                                  }
                                  keys={name}
                                  layout={currentContentTypeLayoutData}
                                  name={name}
                                  onChange={() => {}}
                                />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </FormWrapper>
                );
              })}
              {isRelationViewEnabled && (
                <p className={isStructureCorrect ? 'text-success' : 'text-danger'}>
                  {fetchingStructureCorrectness ? 
                  <FormattedMessage id={`content-manager.containers.EditView.components.validation.relation`}/> :
                  <FormattedMessage
                    values={{relationName: selectedRelationName}}
                    id={`content-manager.containers.EditView.components.${isStructureCorrect ? 'correct' : 'incorrect'}.relation`}/>
                  }
                </p>
              )}
            </div>

            <div className="col-md-12 col-lg-3">
              {currentContentTypeLayoutRelations.length > 0 && (
                <SubWrapper style={{ padding: '0 20px 1px', marginBottom: '25px' }}>
                  <div style={{ paddingTop: '22px' }}>
                    {currentContentTypeLayoutRelations.map(relationName => {
                      const relation = get(
                        currentContentTypeLayoutData,
                        ['schema', 'attributes', relationName],
                        {}
                      );
                      const relationMetas = get(
                        currentContentTypeLayoutData,
                        ['metadatas', relationName, 'edit'],
                        {}
                      );

                      return (
                        <SelectWrapper
                          {...relation}
                          {...relationMetas}
                          key={relationName}
                          name={relationName}
                          relationsType={relation.relationType}
                          setSelectedOption={setSelectedOption}
                          selectedRelationName={selectedRelationName}
                          selectedOption={selectedOption}
                        />
                      );
                    })}
                  </div>
                </SubWrapper>
              )}
              <LinkWrapper>
                <ul>
                  <LiLink
                    message={{
                      id: 'app.links.configure-view',
                    }}
                    icon="layout"
                    key={`${pluginId}.link`}
                    url={`${
                      isSingleType ? `${pathname}/` : ''
                    }ctm-configurations/edit-settings/content-types`}
                    onClick={() => {
                      // emitEvent('willEditContentTypeLayoutFromEditView');
                    }}
                  />
                  {getInjectedComponents(
                    'editView',
                    'right.links',
                    plugins,
                    currentEnvironment,
                    slug
                  )}
                </ul>
              </LinkWrapper>
            </div>
          </div>
        </Container>
      </EditViewDataManagerProvider>
    </EditViewProvider>
  );
};

EditView.defaultProps = {
  currentEnvironment: 'production',
  emitEvent: () => {},
  plugins: {},
};

EditView.propTypes = {
  components: PropTypes.array.isRequired,
  currentEnvironment: PropTypes.string,
  deleteLayout: PropTypes.func.isRequired,
  emitEvent: PropTypes.func,
  layouts: PropTypes.object.isRequired,
  plugins: PropTypes.object,
  slug: PropTypes.string.isRequired,
};

export { EditView };
export default memo(EditView);
