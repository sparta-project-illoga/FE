import React from "react";
import "./BlueButton.css"

function BlueButton(props) {
  return (
    <div>
      <button className="blueButton" onClick={props.onClick}>{props.content}</button>
    </div>
  );
}

export default BlueButton;
