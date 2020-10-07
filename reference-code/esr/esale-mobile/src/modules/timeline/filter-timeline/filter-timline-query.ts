export const queryFilterTimeline = (params: {
  employeeId: number;
  timelineType: Array<any>;
}) => {
  return {
    query: `query
      {
        timelineFilters: (
          employeeId: ${params.employeeId}
          timelineType: ${params.timelineType}	
      }`,
  };
};
