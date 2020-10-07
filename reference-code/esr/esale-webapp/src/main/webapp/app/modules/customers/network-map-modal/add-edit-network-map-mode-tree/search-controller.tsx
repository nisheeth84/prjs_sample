import React, { useState, useCallback, useMemo } from 'react';
import { setStateByTargetValue, safeCall } from 'app/shared/helpers';
import { translate } from 'react-jhipster';
import { decodeUserLogin } from 'app/shared/util/string-utils';

interface ISearchControllerProps {
  onSearch?: (searchTerm: string, employeeId) => void;
  isDisabled?: any
}

export const SearchController = (props: ISearchControllerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const employeeIdLogin = useMemo(() => {
    const infoUserLogin = decodeUserLogin();
    return +infoUserLogin['custom:employee_id'];
  }, []);

  const onSearchTermChange = useCallback(event => {
    event.preventDefault();
    setStateByTargetValue(setSearchTerm)(event);
    setIsSearched(false);
  }, []);

  const onSearch = useCallback(
    event => {
      event.preventDefault();
      if (isSearched) return;
      setIsSearched(true);
      safeCall(props.onSearch)(searchTerm, isChecked ? employeeIdLogin : null);
    },
    [isSearched, isChecked, searchTerm, props.onSearch]
  );

  const checkFilterByEmployeeId = (e) => {
    if (e.target.checked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
    safeCall(props.onSearch)(searchTerm, e.target.checked ? employeeIdLogin : null);
  }

  return (
    <>
      <p className="check-box-item mb-0">
        <label className="icon-check font-weight-normal">
          <input type="checkbox" name="" onChange={checkFilterByEmployeeId} /><i></i>{translate('customers.network-map.business-card-received')}
        </label>
      </p>
      <form className="search-box-no-button-style" onSubmit={onSearch}>
        <button className="icon-search">
          <i className="far fa-search" />
        </button>
        <input type="text" className={props.isDisabled ? "disable" : ""} placeholder={translate('customers.search-controller.placeholder')} defaultValue={searchTerm} onChange={onSearchTermChange} onBlur={onSearch} disabled={props.isDisabled} />
      </form>
    </>
  );
};
