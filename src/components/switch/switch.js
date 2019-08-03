import React from 'react';
import './switch.css';

const Switch = ({ switchToggle, handleToggle, onColor }) => {
  return (
    <>
      <input
        checked={switchToggle}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        style={{ background: switchToggle && onColor }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;