import React from 'react';
import { connect } from "react-redux";
import { IRootState } from "app/shared/reducers";
import { translate } from "react-jhipster";
import _ from 'lodash';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { FIELD_BELONG } from 'app/config/constants'

type IShowSearchFieldProps = StateProps & DispatchProps & {
  onMouseLeave?: any
  openModalSearch?: any
}

const ShowSearchCondition = (props: IShowSearchFieldProps) => {
  let scheduleConditionSearchData = [];
  let taskConditionSearchData = [];
  let milestoneConditionSearchData = [];

  const joinString = (elem) => {
    if (!elem) return "";
    let elString = "";
    for (const el in elem) {
      if (!Object.prototype.hasOwnProperty.call(elem, el)) {
        continue;
      }
      elString += elem[el] + ' ';
    }
    return elString.trim();
  }

  const getDataCondition = (conditionsOri, typeGroup) => {
    const conditionsResult = [];
    if (!_.isArray(conditionsOri)) {
      return conditionsResult;
    }
    for (let i = 0; i < conditionsOri.length; i++) {
      if ((_.isNil(conditionsOri[i].fieldValue) || conditionsOri[i].fieldValue.length === 0) && !conditionsOri[i].isSearchBlank) {
        continue;
      }
      if (conditionsOri[i].fieldBelong !== typeGroup) {
        continue;
      }
      const isArray = Array.isArray(conditionsOri[i].fieldValue);
      const type = conditionsOri[i].fieldType.toString();
      let text = "";
      if (type === DEFINE_FIELD_TYPE.RADIOBOX || type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX || type === DEFINE_FIELD_TYPE.CHECKBOX) {
        if (conditionsOri[i].fieldItems && conditionsOri[i].fieldItems.length > 0) {
          const fieldItem = conditionsOri[i].fieldItems.filter(e => !e.itemId ? false : conditionsOri[i].fieldValue.toString().includes(e.itemId.toString()));
          text = fieldItem.map(function (elem) { return getFieldLabel(elem, 'itemLabel'); }).join(" ");
        } else {
          try {
            const jsonFieldSearch = JSON.parse(conditionsOri[i].fieldValue.toString());
            Object.keys(jsonFieldSearch).forEach(function (key) {
              text += jsonFieldSearch[key] + " ";
            });
          } catch (e) {
            text = conditionsOri[i].fieldValue.toString();
          }
        }
      } else if (isArray) {
        text = `[${conditionsOri[i].fieldValue.map(function (elem) {
          return joinString(elem);
        }).join(" ")}]`;
      } else {
        try {
          const jsonFieldSearch = JSON.parse(conditionsOri[i].fieldValue);
          Object.keys(jsonFieldSearch).forEach(function (key) {
            text += jsonFieldSearch[key] + " ";
          });
        } catch (e) {
          text = conditionsOri[i].fieldValue;
        }
      }
      conditionsResult.push({ "label": getFieldLabel(conditionsOri[i], 'fieldLabel'), text });
    }
    return conditionsResult;
  }

  scheduleConditionSearchData = getDataCondition(props.searchConditions?.conditionsOri, FIELD_BELONG.SCHEDULE);
  taskConditionSearchData = getDataCondition(props.searchConditions?.conditionsOri, FIELD_BELONG.TASK);
  milestoneConditionSearchData = getDataCondition(props.searchConditions?.conditionsOri, FIELD_BELONG.MILE_STONE);

  return (
    <>
      <div className="drop-down">
        <ul className="dropdown-item style-3">
          <li className="item smooth">
            <div className="text text1"><img title="" src="../../../content/images/ic-sidebar-calendar.svg" alt="" />{translate('calendars.modal.calendar')}
            </div>
            <div>
              {scheduleConditionSearchData?.map((field, fieldIdx) => {
                return <p className="text text2" key={'fieldSchedule' + fieldIdx}>{field['label']}: {field['text']}</p>
              })}
            </div>
          </li>
          <li className="item smooth">
            <div className="text text1"><img title="" src="../../../content/images/task/ic-menu-task.svg" alt="" />{translate('calendars.modal.tasks')}
            </div>
            <div>
              {taskConditionSearchData?.map((field, fieldIdx) => {
                return <p className="text text2" key={'fieldSchedule' + fieldIdx}>{field['label']}: {field['text']}</p>
              })}
            </div>
          </li>
          <li className="item smooth">
            <div className="text text1"><img title="" src="../../../content\images\task\ic-flag-brown.svg" alt="" />{translate('calendars.modal.milestone')}
            </div>
            <div>
              {milestoneConditionSearchData?.map((field, fieldIdx) => {
                return <p className="text text2" key={'fieldSchedule' + fieldIdx}>{field['label']}: {field['text']}</p>
              })}
            </div>
          </li>
          <a title="" className="text-blue m-2" onClick={() => props.openModalSearch(true)}> {translate('calendars.modal.showAll')}</a>
        </ul>

      </div>
    </>
  );
}

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
  searchConditions: dataCalendarGrid.searchConditions
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowSearchCondition);
