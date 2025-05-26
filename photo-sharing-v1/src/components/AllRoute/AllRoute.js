import { useRoutes } from "react-router-dom";

import Routes from "../../routes/index";

const routes = [...Routes];

function AllRoute() {
  const elements = useRoutes(routes);
  return <>{elements}</>;
}

export default AllRoute;
