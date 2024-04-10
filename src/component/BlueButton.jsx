import React from "react";
import "./BlueButton.css"

function BlueButton(props) {
  return (
    <div>
      <button className="blueButton">{props.content}</button>
    </div>
  );
}

export default BlueButton;
