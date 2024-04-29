import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import App from "./App";
import "@testing-library/jest-dom/extend-expect";

const renderWithHistory = (Component, route = "/") => {
  const history = createMemoryHistory();
  history.push(route);

  return {
    ...render(<Router location={history.location} navigator={history}><Component /></Router>),
    history,
  };
};

test("renders title", () => {
  const { getByText } = renderWithHistory(App);
  const restaurant = getByText(/periodic tables/i);
  expect(restaurant).toBeInTheDocument();
});

