<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Your app description" />
    <title>Your app title</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>


import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Helmet } from "react-helmet";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/your-subdirectory">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Your app title</title>
        <meta name="description" content="Your app description" />
      </Helmet>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();


import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";
import { Route, Switch } from "react-router-dom";

/**
 * Defines the main layout of the application.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div className="col-md-2 side-bar">
          <Menu />
        </div>
        <div className="col">
          <Switch>
            <Route exact path="/" component={Routes.Home} key="home" />
            <Route exact path="/about" component={Routes.About} key="about" />
            <Route exact path="/contact" component={Routes.Contact} key="contact" />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Layout;


import React from "react";

export const Home = () => <div>Home</div>;
export const About = () => <div>About</div>;
export const Contact = () => <div>Contact</div>;


import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu of the application.
 *
 * @returns {JSX.Element}
 */
function Menu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link" location={{}}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link" location={{}}>
            About
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link" location={{}}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
