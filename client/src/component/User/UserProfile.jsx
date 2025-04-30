import { useSelector } from "react-redux";
import UsingHooks from "../../UsingHooks";

function UserProfile() {
  const user = useSelector((state) => state.user.user);
  console.log({user})

  return (
    <div className="py-28">
      {user ? <h2>Welcome, {user.name}!</h2> : <p>Please log in.</p>}
      <UsingHooks/>
    </div>
  );
}

export default UserProfile;