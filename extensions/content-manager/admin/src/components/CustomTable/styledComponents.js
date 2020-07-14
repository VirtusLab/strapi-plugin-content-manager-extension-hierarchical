/* eslint-disable */
import React from 'react';
import styled, { css } from 'styled-components';
import { Carret } from '@buffetjs/icons';
import { Collapse } from 'reactstrap';

const Table = styled.table`
  border-radius: 3px;
  border-collapse: initial;
  box-shadow: 0 2px 4px #e3e9f3;
  table-layout: fixed;
  margin-bottom: 0;

  tr,
  th,
  td {
    border: none;
    padding: 0;
  }

  th,
  td {
    padding: 0 25px;

    label {
      display: inline;
    }
  }
`;

const Thead = styled.thead`
  background: #f3f3f3;
  height: 43px;
  overflow: hidden;

  th {
    height: 43px;
    border: none !important;
    font-size: 1.3rem;
    vertical-align: middle !important;
    > span {
      position: relative;
      &.sortable {
        cursor: pointer;
      }
    }
  }
  ${({ isBulkable }) => {
    if (isBulkable) {
      return css`
        > tr {
          th:first-child {
            width: 50px;
          }
        }
      `;
    }
  }}
`;

const TableEmpty = styled.tr`
  width: 100%;
  height: 108px;
  background: #ffffff;

  td {
    height: 106px;
    line-height: 90px;
    font-size: 1.3rem;
    font-weight: 400;
    color: #333740;
    text-align: center;
    border-collapse: collapse;
    border-top: 1px solid #f1f1f2 !important;
  }
`;

const TableRow = styled.tr`
  height: 54px;
  background: ${props => props.hightlighted ? '#f57676' : '#ffffff'};
  &:hover {
    cursor: pointer;
    background: ${props => props.hightlighted ? '#f23333' :  '#f7f8f8'};
  }

  td {
    height: 53px;
    font-size: 1.3rem;
    line-height: 1.8rem;
    font-weight: 400;
    color: #333740;
    vertical-align: middle;
    border-collapse: collapse;
    border-top: 1px solid #f1f1f2 !important;
  }
`;

const RootRow = styled.tr`
  height: 54px;
  background: #bfc4c9;
  &:hover {
    cursor: pointer;
    background: #b1bbc9;
  }

  td {
    height: 53px;
    font-size: 1.3rem;
    line-height: 1.8rem;
    font-weight: 400;
    color: #333740;
    vertical-align: middle;
    border-collapse: collapse;
    border-top: 1px solid #f1f1f2 !important;
  }
`;

const ToogleRootRow = styled.div`
  display: contents;
`;

const Arrow = styled(({ isUp, ...rest }) => <Carret {...rest} />)`
  margin-left: 5px;
  ${({ isUp }) =>
    isUp &&
    `
    transform: rotateZ(180deg);

  `}
`;

const Truncate = styled.div``;

const Truncated = styled.p`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
`;

const TableDelete = styled.tr`
  width: 100%;
  height: 36px;
  background: #f7f8f8;

  td {
    height: 36px;
    line-height: 36px;
    font-size: 1.3rem;
    font-weight: 400;
    color: #333740;
    text-align: left;
    border-collapse: collapse;
    border-top: 1px solid #f1f1f2 !important;
  }
`;

const ActionContainer = styled.td`
  text-align: right;

  i,
  svg {
    margin-left: 15px;
    font-size: 1rem;
    height: 1rem;
    color: #333740;

    &:first-of-type {
      margin-left: 0px;
    }
  }
`;
const DeleteSpan = styled.span`
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  &:after {
    content: '—';
    margin: 0 7px;
    font-size: 13px;
    font-weight: 600;
  }
`;

const DeletAllSpan = styled.span`
  position: absolute;
  color: #f64d0a;
  font-weight: 500;
  cursor: pointer;
  &:after {
    position: relative;
    top: -1px;
    content: '\f1f8';
    margin-left: 7px;
    font-size: 13px;
    font-family: FontAwesome;
    -webkit-font-smoothing: antialiased;
  }
`;

const HierarchicalTd  = styled.td`
  padding: 0 !important;
`;

const TreeWraper  = styled.div`
  padding: 0;
  left: ${props => props.level ? props.level : ''};
  position: relative;
  z-index: 1;
  &:before {
    display: block;
    content: '';
    margin-top: -1px;
    height: 2px;
    width: 1.5rem;
    position: absolute;
    top: 50%;
    left: -2rem;
    z-index: -1;
    background-color: #bfbbbb;
    padding-left: 2px;
  }
  &:after {
      display: block;
      content: '';
      margin-left: -1px;
      width: 2px;
      position: absolute;
      top: -2rem;
      bottom: 0;
      left: -2rem;
      z-index: -1;
      background-color: #bfbbbb;
    }
    &:last-child {
      &:after {
        bottom: calc(50% - 1px);
        top: calc(-100%);
      }
    }
`;

const IconsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ArrowWrapper = styled.div`
  margin-left: 20px;
`;


export {
  ActionContainer,
  Arrow,
  DeletAllSpan,
  DeleteSpan,
  Table,
  TableDelete,
  TableEmpty,
  TableRow,
  RootRow,
  ToogleRootRow,
  Thead,
  Truncate,
  Truncated,
  HierarchicalTd,
  TreeWraper,
  IconsWrapper,
  ArrowWrapper
};

