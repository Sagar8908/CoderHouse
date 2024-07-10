import React, { useState } from "react";
import StepOTP from "../Steps/StepOTP/StepOTP";
import StepPhoneEmail from "../Steps/StepPhoneEmail/StepPhoneEmail";

const steps = {
  1: StepPhoneEmail,
  2: StepOTP,
};

function Authenticate() {
  const [step, setstep] = useState(1);
  const Currentstep = steps[step];

  function onNext() {
    setstep(step + 1);
  }

  return (
    <div>
      <Currentstep onNext={onNext} />
    </div>
  );
}

export default Authenticate;
