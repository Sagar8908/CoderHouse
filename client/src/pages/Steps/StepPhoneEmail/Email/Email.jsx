import React, { useState } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css";

const Email = ({ onNext }) => {
  const [email, setemail] = useState("");
  return (
    <Card title="Enter Your Email ID" icon="email-emoji">
      <TextInput placeholder = "Enter Your Email" value={email} onChange={(e) => { console.log(e.target.value); setemail(e.target.value)}} />
      <div className={styles.actionButtonWrap}>
        <Button title="Next" onClick={onNext}></Button>
        <p className={styles.bottomParagraph}>
          By entering your number, you’re agreeing to our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default Email;
