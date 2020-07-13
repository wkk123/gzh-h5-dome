import React from 'react';
import routes from './router';
import { HashRouter, Route, Switch, Redirect} from 'react-router-dom';

const RouteWithSubRoutes = (route) => (
  <Route
    path={route.path}
    render={props => {
      document.title = route.title || "默认title";
      return <route.component {...props} routes={route.routes} />
    }}
  />
);
export default class index extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          <Redirect to="home" />
        </Switch>
      </HashRouter>
    );
  }
}
