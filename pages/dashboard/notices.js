import React, { useContext, useState } from "react";
import Layout from "../../components/layout";
import { authContext } from "../_app";
import Alert from "../../components/alert";
import { combineClasses } from "../../utils/cssClasses";

const styles = {
  noticeListWrapper: "flex flex-col gap-2 p-2",
  actions: "flex justify-end gap-2 focus:ring borderd",
  input:
    "border p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500 transition-all duration-150 focus:w-1/3 ease-in",
  button: "text-slate-50 p-2 rounded-md transition-all ease-in-out",
  addButton: "bg-sky-600 hover:bg-sky-500",
};

const Notices = () => {
  const user = useContext(authContext);
  const [search, setSearch] = useState("");
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  return (
    <Layout>
      {user && !user.active && (
        <Alert severity="Error">
          Your account is not activated. An admin will approve your account
          soon.
        </Alert>
      )}
      <div className={styles.noticeListWrapper}>
        {/* Notices list */}
        <div className={styles.actions}>
          {/* Actions */}
          <button className={combineClasses(styles.button, styles.addButton)}>
            Add New
          </button>
          <input
            className={styles.input}
            type="text"
            name="search"
            placeholder="Search notices"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {/* END NOTICE LISTS */}
    </Layout>
  );
};

export default Notices;
