import { push } from "react-router-redux";

export function goToPage(pageLocation) {
    return (dispatch) => {
        dispatch(push(pageLocation));
    };
}
