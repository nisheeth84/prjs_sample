/**
 *
 * @param params query getScheduleSuggestionsGlobal
 */
export const querySearchServiceCalendar = (params: { searchValue: "" }) => ({
  query: `
    {
        getScheduleSuggestionsGlobal(
          searchValue: ${params.searchValue}
        )
        
    }`,
});

/**
 *
 * @param params query getTimelineSuggestionsGlobal
 */
export const queryGetTimelineSuggestionsGlobal = (params: {
  searchValue: "";
  offset: 1;
  limit: 10;
}) => ({
  query: `
    {
        getScheduleSuggestionsGlobal(
          searchValue: ${params.searchValue}
          offset: ${params.offset}
          limit: ${params.limit}	
        )
    }`,
});

/**
 *
 * @param params query getScheduleSuggestionsGlobal
 */
export const queryScheduleSuggestionsGlobal = (params: {
  searchValue: string;
}) => ({
  query: `
    {
      schedules(
          searchValue: ${params.searchValue}
        )
    }`,
});

/**
 *
 * @param params query getTimelineSuggestionsGlobal
 */
export const queryTimelineSuggestionsGlobal = (params: {
  searchValue: string;
}) => ({
  query: `
    {
      timelines(
          searchValue: ${params.searchValue}
        )
    }`,
});

/**
 *
 * @param params query getBusinessCardSuggestionsGlobal
 */
export const queryBusinessCardSuggestionsGlobal = (params: {
  searchValue: string;
}) => ({
  query: `
    {
      businesscards(
          searchValue: ${params.searchValue}
        )
    }`,
});

/**
 *
 * @param params query Customer
 */
export const queryCustomerSuggestionsGlobal = (params: {
  searchValue: string;
}) => ({
  query: `
    {
      customer(
          searchValue: ${params.searchValue}
          limit
          offset
        )
    }`,
});

/**
 *
 * @param params query Activities
 */
export const querySearch = (params: { searchValue: string }) => ({
  query: `
    {
      activities(
          searchValue: ${params.searchValue}
          limit
          offset
        )
    }`,
});
