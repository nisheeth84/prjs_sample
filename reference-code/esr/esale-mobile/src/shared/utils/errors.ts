// Tracking normal status response
export const normalizeHttpError = (error: any) => {
  switch (error.response.status) {
    case 400:
      return new Error('Bad Request');
    case 403:
      return new Error('You are not authorized to access this data');
    case 500:
      throw new Error('Internal server error, please try again');
    default:
      return new Error(JSON.stringify(error.response));
  }
};
