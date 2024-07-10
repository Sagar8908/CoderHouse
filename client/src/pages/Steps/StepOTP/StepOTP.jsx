import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import TextInput from "../../../components/shared/TextInput/TextInput";
import styles from "./StepOTP.module.css";
import { verifyOtp } from "../../../http";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAuth } from "../../../Store/authSlice";
const StepOTP = () => {
  const [otp, setotp] = useState("");
  const dispatch = useDispatch();
  const { phone, hash } = useSelector((state) => state.auth.OTP);
  async function onSubmit() {
    if (!otp || !phone || !hash) {
      return;
    }
    try {
      const data = await verifyOtp({ OTP: otp, phone, hash });
      console.log(data);
      dispatch(setAuth(data.data));
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="lock-emoji">
          <TextInput value={otp} onChange={(e) => setotp(e.target.value)} />
          <div className={styles.actionButtonWrap}>
            <Button onClick={onSubmit} title="Next" />
          </div>
          <p className={styles.bottomParagraph}>
            By entering your number, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default StepOTP;
