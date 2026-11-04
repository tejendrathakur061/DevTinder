import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/Constants";
import { addFeed } from "../utils/feedSlice";

const UserCard = ({ users = [] }) => {
  const dispatch = useDispatch();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  if (users.length === 0) {
    return (
      <section className="w-full max-w-sm rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-lg">
        <h1 className="text-xl font-bold">You&apos;re all caught up</h1>
        <p className="mt-2 text-sm opacity-70">
          Check back later to discover more people.
        </p>
      </section>
    );
  }

  const user = users[0];

  const handleRequest = async (status) => {
    setIsSending(true);
    setError("");

    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${user._id}`,
        {},
        { withCredentials: true },
      );
      dispatch(addFeed(users.slice(1)));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Could not send your response. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <article className="mx-auto mt-6 w-full max-w-sm overflow-hidden rounded-3xl bg-base-100 shadow-xl ring-1 ring-base-300">
      <div className="relative aspect-4/5 overflow-hidden bg-base-300">
          <img
            src={
              user.imgURL ||
              `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`
            }
            alt={`${user.firstName} ${user.lastName}`}
            className="h-full w-full object-cover"
          />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
        <p className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          1 of {users.length}
        </p>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h1 className="text-3xl font-bold leading-tight">
            {user.firstName}
            {user.age ? `, ${user.age}` : ""}
          </h1>
          {user.gender && (
            <p className="mt-1 text-sm capitalize text-white/85">
              {user.gender}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-sm font-semibold">About</h2>
          <p className="mt-1 text-sm leading-relaxed opacity-75">
            {user.about || "No bio added yet."}
          </p>
        </div>

        {user.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span key={skill} className="badge badge-outline">
                {skill}
              </span>
            ))}
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-error">
            {typeof error === "string"
              ? error
              : "Could not send your response. Please try again."}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            className="btn btn-outline btn-error rounded-full"
            disabled={isSending}
            onClick={() => handleRequest("ignored")}
          >
            Ignore
          </button>
          <button
            className="btn btn-primary rounded-full"
            disabled={isSending}
            onClick={() => handleRequest("interested")}
          >
            Interested
          </button>
        </div>
      </div>
    </article>
  );
};

export default UserCard;
