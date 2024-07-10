  import React,{useState} from 'react'
  import Card from "../../../components/shared/Card/Card";
  import Button from "../../../components/shared/Button/Button";
  import TextInput from "../../../components/shared/TextInput/TextInput";
  import { useDispatch, useSelector } from "react-redux";
  import styles from "./StepName.module.css";
  import { setName } from "../../../Store/activateSlice";

  const StepName = ({ onNext }) => {
    const  { name }  = useSelector((state) => state.activate);
    const dispatch = useDispatch();
    const [fullname, setFullname] = useState(name);
    function nextStep() {
      if (!fullname) {
        return;
      }
      dispatch(setName(fullname));
      onNext();
    }
    return (
      <div className={styles.cardWrapper}>
        <Card title="What’s your full name?" icon="goggle-emoji">
          <TextInput
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <p className={styles.bottomParagraph}>
            People use real names at codershouse :) !
          </p>
          <div className={styles.actionButtonWrap}>
            <Button onClick={nextStep} title="Next" />
          </div>
        </Card>
      </div>
    );
  };

  export default StepName