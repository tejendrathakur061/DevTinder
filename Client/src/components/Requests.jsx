import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/Constants";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [loading, setLoading] = useState(true);
  const [busyRequest, setBusyRequest] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/requests/received`, {
          withCredentials: true,
        });
        dispatch(addRequests(res.data.data));
      } catch (error) {
        setError(
          error.response?.data?.message || "Could not load your requests.",
        );
      } finally {
        setLoading(false);
      }
    };

    getRequests();
  }, [dispatch]);

  const reviewRequest = async (requestId, status) => {
    setError("");
    setBusyRequest(requestId);

    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(requestId));
    } catch (error) {
      setError(
        error.response?.data?.message || "Could not update this request.",
      );
    } finally {
      setBusyRequest("");
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center text-sm opacity-70">Loading requests...</p>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Make a connection
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Requests</h1>
          {requests.length > 0 && (
            <span className="badge badge-primary badge-outline">
              {requests.length} new
            </span>
          )}
        </div>
        <p className="mt-2 text-sm opacity-70">
          People who would like to connect with you.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-2xl bg-error/10 p-4 text-center text-sm text-error"
        >
          {error}
        </p>
      )}

      {requests.length === 0 ? (
        <section className="rounded-3xl border border-base-300 bg-base-100 px-6 py-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold">No requests yet</h2>
          <p className="mt-2 text-sm opacity-70">
            When someone wants to connect, you&apos;ll find their request here.
          </p>
        </section>
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {requests.map((request) => {
            const user = request.fromUserId;

            return (
              <article
                key={request._id}
                className="group flex flex-wrap items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm transition duration-200 hover:shadow-md sm:flex-nowrap sm:gap-4 sm:p-4"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-base-300 ring-1 ring-base-300 sm:h-18 sm:w-18">
                  <img
                    src={
                      user.imgURL ||
                      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-sm font-bold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-success"
                      aria-label="New request"
                      title="New request"
                    />
                  </div>
                  {(user.age || user.gender) && (
                    <div className="mt-1 flex flex-col gap-0.5 text-xs capitalize opacity-65">
                      {user.age && <span>{user.age} years old</span>}
                      {user.gender && <span>{user.gender}</span>}
                    </div>
                  )}
                  <p className="mt-1 line-clamp-1 text-xs opacity-75">
                    {user.about || "Would like to connect with you"}
                  </p>
                </div>
                <div className="flex w-full justify-between gap-3 border-t border-base-300 pt-3 sm:w-auto sm:justify-end sm:border-0 sm:pt-0">
                  <button
                    className="btn btn-outline btn-error btn-sm min-w-24 flex-1 rounded-full sm:flex-none"
                    disabled={busyRequest === request._id}
                    onClick={() => reviewRequest(request._id, "rejected")}
                  >
                    Pass
                  </button>
                  <button
                    className="btn btn-primary btn-sm min-w-28 flex-1 rounded-full shadow-sm sm:flex-none"
                    disabled={busyRequest === request._id}
                    onClick={() => reviewRequest(request._id, "accepted")}
                  >
                    Connect
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Requests;
