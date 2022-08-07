import { useContext, useEffect, useRef, useState } from "react";
import { authContext } from "../pages/_app";
import { useRouter } from "next/router";
import Loading from "./loading";
import Sidebar from "./sidebar";
const styles = {
  wrapper: "",
};

export default function Layout({ children }) {
  const user = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const handleOnLoading = () => setLoading(true);
  const handleOfLoading = () => setLoading(false);
  const router = useRouter();
  useEffect(() => {
    let timerId;
    handleOnLoading();
    if (!user) {
      timerId = setTimeout(() => {
        handleOfLoading();
        router.push("/signin");
      }, 2000);
    } else {
      handleOfLoading();
    }

    return () => clearTimeout(timerId);
  });
  return (
    <div className="max-w-screen-xl bg-white mx-auto w-full p-2 flex flex-col sm:flex-row">
      <Loading open={loading} />
      <div className="basis-1/4 max-h-screen h-screen overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-grow p-2">{children}</div>
    </div>
  );
}
