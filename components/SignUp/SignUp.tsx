import React, { Dispatch, SetStateAction, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { userInfo } from "../../pages/game";
import styles from "./SignUp.module.css";
import randomstring from "randomstring";
import userStore from "../../stores/userStore";

const SignUp = ({ hide }: { hide: boolean }) => {
  return (
    <div className={`${styles.signUp}  ${hide && styles.hide}`}>
      <div className={styles.wrapper}>
        <h1>Gday, Socceroo 🦘</h1>
        <UserInfoForm />
      </div>
    </div>
  );
};

const UserInfoForm = () => {
  const setUserInfo = userStore((state) => state.setUserInfo);
  return (
    <Formik
      initialValues={{ name: "", carType: "pickup", score: 0 }}
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

export default SignUp;
