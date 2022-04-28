import React, { Dispatch, SetStateAction, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { userInfo } from "../../pages/game";
import styles from "./SignUp.module.css";
import randomstring from "randomstring";

const SignUp = ({
  setUserInfo,
  setSessionId
}: {
  setUserInfo: Dispatch<SetStateAction<userInfo | null>>;
  setSessionId: Dispatch<
    SetStateAction<{ type: string; sessionId: string } | null>
  >;
}) => {
  const [step, setStep] = useState(0);
  return (
    <div className={styles.signUp}>
      <div className={styles.wrapper}>
        <h1>G'day, Socceroo 🦘</h1>
        {step === 0 ? (
          <UserInfoForm setUserInfo={setUserInfo} setStep={setStep} />
        ) : (
          <SessionForm setSessionId={setSessionId} />
        )}
      </div>
    </div>
  );
};

const UserInfoForm = ({
  setUserInfo,
  setStep
}: {
  setUserInfo: Dispatch<SetStateAction<userInfo | null>>;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <Formik
      initialValues={{ name: "", carType: "", score: 0 }}
      validate={(values) => {
        const errors: { name?: string } = {};
        if (!values.name) {
          errors.name = "Required";
        } else if (values.name.length > 2) {
          errors.name = "Must be 2 letters or less";
        } else if (!values.carType) {
          errors.name = "Required ";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setUserInfo(values);
        setStep(1);
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <p>Your initials (2 letters)</p>
          <Field type='text' name='name' />
          <ErrorMessage name='email' component='div' />
          <br />
          <p>Choose your car</p>
          <div
            className={styles.carType}
            role='group'
            aria-labelledby='my-radio-group'
          >
            <label
              className={
                values.carType === "pickup" ? styles.selected : undefined
              }
            >
              <Field type='radio' name='carType' value='pickup' />
              <img src='/images/pickup.png' alt='pickup' />
              Raptor
            </label>
            <label
              className={
                values.carType === "sedan" ? styles.selected : undefined
              }
            >
              <Field type='radio' name='carType' value='sedan' />
              <img src='/images/sedan.png' alt='sedan' />
              Sedane
            </label>
            <label
              className={
                values.carType === "jeep" ? styles.selected : undefined
              }
            >
              <Field type='radio' name='carType' value='jeep' />
              <img src='/images/jeep.png' alt='jeep' />
              Rooney
            </label>
          </div>
          <button type='submit' disabled={isSubmitting}>
            Next
          </button>
        </Form>
      )}
    </Formik>
  );
};

const SessionForm = ({
  setSessionId
}: {
  setSessionId: Dispatch<
    SetStateAction<{ type: string; sessionId: string } | null>
  >;
}) => {
  const [type, setType] = useState("remote");
  return (
    <Formik
      initialValues={{ id: "" }}
      validate={(values) => {
        const errors: { name?: string } = {};
        if (!values.id) {
          errors.name = "Required";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSessionId({ type: type, sessionId: values.id });
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <p>Enter your Session ID</p>
          <Field type='text' name='id' placeholder='xxxx-xxxx-xxx' />
          <ErrorMessage name='id' component='div' />
          <br />
          <button type='submit' disabled={isSubmitting || values.id === ""}>
            Start 🔥
          </button>
          <button
            type='submit'
            onClick={() => {
              const sessionID = randomstring.generate();
              setFieldValue("id", sessionID);
              setSessionId({ type: "host", sessionId: sessionID });
            }}
            className={styles.host}
          >
            Host one
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default SignUp;
