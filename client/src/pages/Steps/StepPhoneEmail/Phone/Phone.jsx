import React, { useState } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css";
import { sendOtp } from "../../../../http/index";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../Store/authSlice";

const Phone = ({ onNext }) => {
  const [phoneNumber, setphoneNumber] = useState("");
  const dispatch = useDispatch();

  async function onSubmit() {
    // console.log(phoneNumber);
    if (!phoneNumber) {
      return;
    }
    const { data } = await sendOtp({ phone: phoneNumber });
    console.log(data);
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    onNext();
  }

  return (
    <Card title="Enter Your Phone Number" icon="phone">
      <div>
        <TextInput
          value={phoneNumber}
          onChange={(e) => {
            // console.log("Input changed:", e.target.value);
            setphoneNumber(e.target.value);
          }}
        />
        <div className={styles.actionButtonWrap}>
          <Button title="Next" onClick={onSubmit}></Button>
          <p className={styles.bottomParagraph}>
            By entering your number, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Phone;
