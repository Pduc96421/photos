import { getCookie } from "../../helpers/cookie";

function loginReducer(state, action) {
  const token = getCookie("token");
  token ? (state = true) : (state = false);

  switch (action.type) {
    case "CHECK_LOGIN":
      return action.status;

    default:
      return state;
  }
}

export default loginReducer;
