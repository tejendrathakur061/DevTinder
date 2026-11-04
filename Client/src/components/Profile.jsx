import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);

  if (!user) {
    return <h1>Loading profile...</h1>;
  }

  return (
    <div>
      <EditProfile user={user} />
    </div>
  );
};

export default Profile;
