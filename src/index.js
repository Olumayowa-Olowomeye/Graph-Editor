import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ConsoleLog } from "react-console-log";
class Page extends React.Component {
    render(){
        return [
      <React.Fragment>
        <App />
        {/* <ConsoleLog/> */}
      </React.Fragment>]
    }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Page />);