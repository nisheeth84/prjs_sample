import React, {
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback
} from 'react';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import {
  unless,
  isNil,
  map,
  reject,
  compose,
  startsWith,
  addIndex,
  ifElse,
  always,
  propOr,
  equals,
  flatten,
  join,
  pluck,
  difference
} from 'ramda';
import { filterDataNotNull } from 'app/shared/util/utils';
import useWillReceiveProps from 'app/modules/products/components/useWillReceiveProps';

const WarppedDynamicList = forwardRef((props: any, ref) => {
  const [css, setCss] = useState('');
  const tableListRef = useRef(null);
  const [tableId] = useState(`warpped-dynamic-list_${new Date().getTime()}`);
  const [currentFieldsFilterOrder, setCurrentFieldsFilterOrder] = useState({ filter: [], order: [] });

  useWillReceiveProps(props.records, (prevProp, currentProp) => {
    if((!prevProp || prevProp.length === 0) && currentProp?.length ){
      props.forceRender()
    }
  })

  useImperativeHandle(
    ref,
    () => ({
      ...tableListRef.current
    }),
    [tableListRef.current]
  );

  const { id, records, belong, keyRecordId, onActionFilterOrder, ...otherProps } = props;

  const handleFilterOrder = (filter: [], order: []) => {
    setCurrentFieldsFilterOrder({ filter, order });
    onActionFilterOrder(filter, order);
  }

  const onBeforeRender = useCallback(
    () =>
      unless(isNil, table => {
        const getFielsMap = compose(
          reject(isNil),
          addIndex(map)((val, idx) =>
            ifElse(
              compose(
                startsWith('customer'),
                propOr('', 'fieldName')
              ),
              always(idx),
              always(null)
            )(val)
          )
        );
      
                
        const getRowspan = rows => {
          const rowWithRowspan = {};
          let i = 0;
          let k = 0;
          rowWithRowspan[k] = 1;
          while(i < rows.length - 1) {
            if (rows[i].customer_id === rows[i + 1].customer_id ) {
              rowWithRowspan[k] += 1;
              rowWithRowspan[i + 1] = -1;
            } else {
              k = i + 1;
              rowWithRowspan[k] = 1;
            }
            i += 1;
          }

          return rowWithRowspan;
        };

        const getCssTable = (cssSelector, rowsWithRowspan, cols) =>
          compose(
            join(' '),
            flatten,
            _ => {
              const { filter, order } = currentFieldsFilterOrder;
              const customerOrder = order.find(item => item.key === 'customer_id');
              const customerFilter = filter.find(item => item.fieldName === 'customer_id');

              const isNotMergeCell = (
                (order?.length || filter?.length) &&
                !customerOrder &&
                !customerFilter?.fieldValue
              );
              // return
              return Object.entries(rowsWithRowspan).map(([rowIndex, valueRowspan]) => {

                return map(colIndex => {
                  const cellSelector = `${cssSelector} tr:nth-child(${Number(rowIndex) + 1}) td:nth-child(${colIndex +
                    1})`;

                  const td = document.querySelector(cellSelector);
                  let display = 'table-cell';
                  let verticalAlign = 'middle';
                  let paddingTop = '0';

                  if (isNotMergeCell) {
                    td?.removeAttribute('rowspan');
                  }
                  else if (valueRowspan === -1) {
                    display = 'none';
                  }
                  else {
                    td?.setAttribute('rowspan', `${valueRowspan}`);
                    verticalAlign = 'baseline !important';
                    paddingTop = '23px';
                  }

                  const cssForCell = `
                    ${cellSelector} {
                      display: ${display};
                      vertical-align: ${verticalAlign};
                      padding-top: ${paddingTop};
                    }
                    `;

                  return cssForCell;
                }, cols);
              });
            }
          )(rowsWithRowspan);

        // ---
        const freeFields = table.getFreeFields();
        const lockFields = table.getLockFields();
        const freeFieldsMap = getFielsMap(freeFields);
        const lockFieldsMap = getFielsMap(lockFields);
        const rowsMapRowspan = getRowspan(records);
        

        // const allFieldOrdersFree = filterDataNotNull(pluck('fieldOrder', freeFields))
        const allFieldOrdersFree = freeFields.map((fieldItem, idx) => fieldItem = idx)
        // console.log(allFieldOrdersFree);
        const diffFieldOrdersFree = difference(allFieldOrdersFree, freeFieldsMap) 
        const allFieldOrdersLock = filterDataNotNull(pluck('fieldOrder', lockFields))
        const diffFieldOrdersLock = difference(allFieldOrdersLock, lockFieldsMap) 
        const fakeArr = new Array(records.length).fill(1)
        const fakeObj = {}
        fakeArr.forEach((_, _idx) => {
          fakeObj[_idx] = 1
        })
 
        compose(
          setCss,
          join(' ')
        )([
          getCssTable(
            `#${tableId} .wrap-table-scroll:nth-child(1) .vertical-align-middle`,
            rowsMapRowspan,
            lockFieldsMap
          ),
          getCssTable(
            `#${tableId} .wrap-table-scroll:nth-child(2) .vertical-align-middle`,
            rowsMapRowspan,
            freeFieldsMap
          ),
          getCssTable(
            `#${tableId} .wrap-table-scroll:nth-child(2) .vertical-align-middle`,
            fakeObj,
            diffFieldOrdersFree
          ),
          getCssTable(
            `#${tableId} .wrap-table-scroll:nth-child(1) .vertical-align-middle`,
            fakeObj,
            diffFieldOrdersLock
          ),
        ]);

      })(tableListRef.current),
    [tableListRef.current, currentFieldsFilterOrder, records]
  );

  const style = useMemo(() => {
    return {
      __html: css
    };
  }, [css]);

  return (
    <div id={tableId}>
      <DynamicList
        ref={tableListRef}
        id={id}
        records={records}
        belong={belong}
        keyRecordId={keyRecordId}
        onBeforeRender={onBeforeRender}
        onActionFilterOrder={handleFilterOrder}
        {...otherProps}
      />
      <style dangerouslySetInnerHTML={style} />
    </div>
  );
});

export default WarppedDynamicList;
