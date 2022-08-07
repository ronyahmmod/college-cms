import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading = ({ open }) => {
  const styles = {
    wrapper: `h-screen top-0 bottom-0 left-0 right-0 w-screen bg-[rgba(0,0,0,.8)] fixed ${
      open ? "block" : "hidden"
    } `,
  };
  return (
    <div className={styles.wrapper}>
      <div className="absolute left-1/2  top-1/2 bottom-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 h-1/2 w-1/2 flex flex-col items-center justify-center shadow-lg">
        <h2>Loading</h2>
        <h2 className="animate-spin">
          <FaSpinner />
        </h2>
      </div>
    </div>
  );
};

export default Loading;
