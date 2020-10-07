
export interface ActivitiesState{
  messages:any
}
interface Messages {
  type?: any,
  content?: string,
  isShow?: any 
}
/**
 * Get Type Messages
 */
export interface GetTypeMessages {
  messages: Messages
}