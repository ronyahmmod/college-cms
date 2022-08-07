import React, { useContext } from "react";
import Layout from "../components/layout";
import Alert from "../components/alert";
import { authContext } from "./_app";

const Dashboard = () => {
  const user = useContext(authContext);
  console.log(user);

  return (
    <Layout>
      {user && !user.active && (
        <Alert severity="error">
          Your account is not activated. An admin will approve your account
          soon.
        </Alert>
      )}
    </Layout>
  );
};

export default Dashboard;
