import React from "react";
export default function Button(props) {
  return (
    <button className="auth-button" onClick={props.onClick}>
      {props.text}
    </button>
  );
}
