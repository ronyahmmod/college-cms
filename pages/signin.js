import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { authContext } from "./_app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Loading from "../components/loading";
import { useRouter } from "next/router";

export const styles = {
  wrapper:
    "flex flex-col items-center justify-center min-w-screen min-h-screen",
  loginContainer: "flex flex-col w-1/3 relative",
  form: "bg-slate-50 flex flex-col w-full p-16 gap-4 rounded-md shadow-md",
  input:
    "border p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500",
  button: "text-slate-50 p-2 rounded-md transition-all ease-in-out",
  cancleButton: "bg-red-600 hover:bg-red-500",
  submitButton: "bg-sky-600 hover:bg-sky-500",
  buttonGroup: "flex gap-4",
};

export function combineClasses(classList) {
  if (!classList) {
    return "";
  } else {
    return classList.reduce(
      (prevClass, currentClass) => prevClass + " " + currentClass
    );
  }
}

export default function Login() {
  const user = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const handleOnLoading = () => setLoading(true);
  const handleOfLoading = () => setLoading(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(getAuth(), email, password)
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
              Login
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
    </div>
  );
}
