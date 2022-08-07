import React from "react";
import { combineClasses } from "../utils/cssClasses";
import {
  AiOutlineIssuesClose,
  AiOutlineWarning,
  AiOutlineBulb,
} from "react-icons/ai";

const renderColorAndLogo = (severity) => {
  switch (severity.toLowerCase()) {
    case "warning": {
      return ["bg-[#EBC002]", AiOutlineWarning];
    }
    case "error": {
      return ["bg-[#EB3F46]", AiOutlineIssuesClose];
    }
    case "success": {
      return ["bg-[#2BC48C]", AiOutlineBulb];
    }
  }
};

const styles = {
  wrapper: "text-sm text-slate-50 p-3 rounded-sm flex items-center gap-2",
  icon: "w-6 h-6",
};

const Alert = ({ severity, children }) => {
  const [bgColor, Icon] = renderColorAndLogo(severity);
  return (
    <div className={combineClasses(styles.wrapper, bgColor)}>
      {<Icon className={styles.icon} />} {children}
    </div>
  );
};

export default Alert;
