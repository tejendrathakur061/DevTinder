import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/Constants";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getConnections = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        });
        dispatch(addConnections(res.data.data));
      } catch (error) {
        setError(
          error.response?.data?.message || "Could not load your connections.",
        );
      } finally {
        setLoading(false);
      }
    };
    getConnections();
  }, [dispatch]);

  if (loading) {
    return (
      <p className="mt-10 text-center text-sm opacity-70">
        Loading connections...
      </p>
    );
  }

  if (error) {
    return (
      <p
        role="alert"
        className="mx-auto mt-10 max-w-md rounded-2xl bg-error/10 p-4 text-center text-error"
      >
        {error}
      </p>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Your community
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Connections
          </h1>
          {connections.length > 0 && (
            <span className="badge badge-primary badge-outline badge-lg">
              {connections.length}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed opacity-65">
          {connections.length
            ? "People you’ve connected with."
            : "People you connect with will show up here."}
        </p>
      </header>

      {connections.length === 0 ? (
        <section className="rounded-3xl border border-base-300 bg-base-100 px-6 py-14 text-center shadow-sm sm:px-10">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-2xl text-primary">
            ♥
          </div>
          <h2 className="text-xl font-bold">
            Your next connection is out there
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed opacity-65">
            Discover people and start building your network.
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          {connections.map((user) => {
            const details = [
              user.age && `${user.age} years old`,
              user.gender,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <article
                key={user._id}
                className="group flex min-w-0 items-center gap-4 border-b border-base-300/70 p-4 transition-colors last:border-b-0 hover:bg-base-200/40 sm:gap-5 sm:px-5 sm:py-4"
              >
                <div className="relative h-16 w-16 shrink-0 sm:h-18 sm:w-18">
                  <img
                    src={
                      user.imgURL ||
                      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-full w-full rounded-full bg-base-300 object-cover ring-2 ring-base-100"
                  />
                  <span
                    className="absolute bottom-0 right-0 grid h-5 w-5 place-items-center rounded-full border-2 border-base-100 bg-success text-[10px] font-bold text-success-content"
                    aria-label="Connected"
                    title="Connected"
                  >
                    ✓
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-bold sm:text-base">
                    {user.firstName} {user.lastName}
                  </h2>
                  {details && (
                    <p className="mt-1 truncate text-xs capitalize opacity-60">
                      {details}
                    </p>
                  )}
                  <p className="mt-1 line-clamp-1 text-xs leading-relaxed opacity-70 sm:text-sm">
                    {user.about || "No bio added yet."}
                  </p>
                </div>
                <span className="badge badge-success badge-outline hidden shrink-0 sm:inline-flex">
                  Connected
                </span>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Connections;
