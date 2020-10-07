

export const queryFollowedList = (
  params: any = {
    emloyeeId: null,
    limit: 30,
    offset: 0,
    followTargetType: null,
    followTargetId: null
  }
) => {
  return {
    query: `query{
        getFolloweds(
          emloyeeId: ${params.emloyeeId},
          limit: ${params.limit},
          offset: ${params.offset},
          followTargetType: ${params.followTargetType},
          followTargetId: ${params.followTargetId}
        )
        {
          followeds{
            followTargetId	
            followTargetType	
            followTargetName	
            createdDate	
          }
        }
      }`,
  };
};
