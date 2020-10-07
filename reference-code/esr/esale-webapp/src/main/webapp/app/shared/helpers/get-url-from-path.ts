import { join } from 'ramda';

export const getUrlFromPath: (path: string[]) => string = join('/');
