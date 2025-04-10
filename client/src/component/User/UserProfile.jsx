import { useSelector } from "react-redux";

function UserProfile() {
  const user = useSelector((state) => state.user.user);
  console.log({user})

  return (
    <div className="py-28">
      {user ? <h2>Welcome, {user.name}!</h2> : <p>Please log in.</p>}
    </div>
  );
}

export default UserProfile;