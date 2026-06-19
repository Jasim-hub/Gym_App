import { Navigate } from "react-router-dom";

function MembershipProtected({ children }) {
  const membership = JSON.parse(
    localStorage.getItem("membership")
  );

  if (
    !membership ||
    membership.status === "Inactive" ||
    membership.status === "Expired"
  ) {
    return <Navigate to="/fee" />;
  }

  return children;
}

export default MembershipProtected;