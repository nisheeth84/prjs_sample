import { useDispatch } from "react-redux";
import { calendarActions } from "../calendar-reducer";
/**
 * set status loading
 * @param status 
 */
export const setStatusLoading = (status: boolean) => {
    const dispatch = useDispatch();
    dispatch(
      calendarActions.setStatusLoading({
        statusLoading: status,
      })
    );
}