import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/Constants";
import { addFeed } from "../utils/feedSlice";
import { useCallback, useEffect, useState } from "react";
import UserCard from "./UserCard";

const requestFeed = () =>
  axios.get(`${BASE_URL}/feed`, {
    withCredentials: true,
  });

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [feedError, setFeedError] = useState("");

  const getFeed = useCallback(async () => {
    setFeedError("");
    try {
      const res = await requestFeed();
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Feed Error:", error);
      setFeedError("Could not load profiles. Check the API connection and try again.");
    }
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
    requestFeed()
      .then((res) => {
        if (isMounted) dispatch(addFeed(res.data));
      })
      .catch((error) => {
        console.error("Feed Error:", error);
        if (isMounted) {
          setFeedError(
            "Could not load profiles. Check the API connection and try again.",
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (feed === null) {
    if (feedError) {
      return (
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <p role="alert" className="text-error">
            {feedError}
          </p>
          <button
            className="btn btn-primary"
            onClick={getFeed}
          >
            Try again
          </button>
        </div>
      );
    }

    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex justify-center mt-5">
      <UserCard users={feed} />
    </div>
  );
};

export default Feed;
