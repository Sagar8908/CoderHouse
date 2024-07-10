import React from "react";
import styles from "./Button.module.css";

function Button({title , onClick}) {
    return (
        <button onClick={onClick} className={styles.button}>
        <span>{title}</span>
        <img
          className={styles.arrow}
          src="/images/arrow-forward.png"
          alt="arrow"
        />
      </button>
    );
}

export default Button;
