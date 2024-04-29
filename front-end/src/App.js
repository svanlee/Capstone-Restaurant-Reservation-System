import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./layout/Layout";
import NoMatch from "./components/NoMatch";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Layout />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
   
