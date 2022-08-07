import React, { useContext, useEffect, useState } from "react";
import { styles, combineClasses } from "./signin";
import Image from "next/image";
import { authContext } from "./_app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import Loading from "../components/loading";
const Register = () => {
  const user = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const handleOnLoading = () => setLoading(true);
  const handleOfLoading = () => setLoading(false);
  const router = useRouter();
  useEffect(() => {
    let timerId;
    if (user) {
      handleOnLoading();
      timerId = setTimeout(() => {
        router.push("/dashboard");
        handleOfLoading();
        console.log("You already logged in. You shipped to dashboard shortly");
      }, 3000);
    }
    return () => clearTimeout(timerId);
  });
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        if (user) {
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
  };
  return (
    <div className={styles.wrapper}>
      <Loading open={loading} />

      {!loading && (
        <div className={styles.loginContainer}>
          <div className="h-12 w-12 absolute left-1/2 right-1/2 -translate-x-1/2 -top-5 z-50 object-cover flex items-center justify-center border-2 rounded-full border-slate-200">
            <Image
              src="/logos/college-logo.png"
              alt="college-log"
              height={48}
              width={48}
              className="rounded-full object-cover"
            />
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              className={styles.input}
              value={email}
              onChange={handleChangeEmail}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className={styles.input}
              value={password}
              onChange={handleChangePassword}
              required
            />
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={combineClasses([styles.button, styles.submitButton])}
              >
                Register
              </button>
              <button
                type="reset"
                className={combineClasses([styles.button, styles.cancleButton])}
                onClick={() => handleReset()}
              >
                Cancle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
