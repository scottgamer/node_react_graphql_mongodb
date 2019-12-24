import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";

import MainNavigation from "./components/Navigation/MainNavigation";

import AuthContext from "./context/auth-context";

import "./App.css";

function App() {
  const [isAuth, setAuth] = useState({ token: null, userId: null });

  const login = (token, userId, tokenExpiration) => {
    setAuth({ ...isAuth, token, userId });
  };

  const logout = () => {
    setAuth({ ...isAuth, token: null, userId: null });
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{ token: isAuth.token, userId: isAuth.userId, login: login, logout: logout }}
      >
        <MainNavigation />
        <main className="main-content">
          <Switch>
            {isAuth.token && <Redirect from="/" to="/events" exact />}
            {isAuth.token && <Redirect from="/auth" to="/events" exact />}

            {!isAuth.token && <Route path="/auth" component={AuthPage} />}
            <Route path="/events" component={EventsPage} />

            {isAuth && <Route path="/bookings" component={BookingsPage} />}
            {!isAuth.token && <Redirect to="/auth" exact />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
