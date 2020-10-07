import axios from "axios";
const domain = "sb-dev-helpsite.ms2-dev.com";
export const baseUrlHelp = `https://${domain}`;

/**
 * api get list help
 * @param categories
 */
export const getListPost = async (perPage?: any, offset?: any) => {
  try {
    return await axios.get(`${baseUrlHelp}/wp-json/wp/v2/posts?perPage=${perPage}&offset=${offset}`);
  } catch (error) {
    return error;
  }
};
/**
 * api search help
 * @param search
 * @param per_page
 */
export const searchHelp = async (search: string, per_page: number, page: number) => {
  try {
    return await axios.get(
      `${baseUrlHelp}/wp-json/wp/v2/posts?search=${search}&per_page=${per_page}&offset=${page}`
    );
  } catch (error) {
    return error;
  }
  
};
