import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/Constants";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Feed Error:", error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (feed === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex justify-center mt-5">
      <UserCard users={feed} />
    </div>
  );
};

export default Feed;
