import React from "react";
import ReactDOM from "react-dom";
// import AuthenticatedChat from "./Chats/AuthenticatedChat";
import UnauthenticatedChat from "./Chats/UnauthenticatedChat";

import "./index.css";

ReactDOM.render(<UnauthenticatedChat />, document.getElementById("root"));
