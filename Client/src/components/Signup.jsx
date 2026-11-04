import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Constants";

const Signup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    emailId: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrorMessage("");
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await axios.post(
        `${BASE_URL}/signup`,
        { ...form, age: Number(form.age) },
        { withCredentials: true },
      );
      navigate("/login", {
        state: { signupSuccess: true, emailId: form.emailId },
      });
    } catch (error) {
      const message = error.response?.data;
      setErrorMessage(
        typeof message === "string"
          ? message
          : message?.message || "Could not create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex justify-center px-4 py-10 sm:py-14">
      <section className="w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 shadow-xl">
        <div className="p-6 sm:p-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Meet your people
          </p>
          <h1 className="mt-2 text-center text-3xl font-bold">
            Create account
          </h1>
          <p className="mt-2 text-center text-sm opacity-70">
            Add your basic information to get started.
          </p>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control">
                <span className="label-text mb-2 font-medium">First name</span>
                <input
                  className="input input-bordered w-full rounded-xl"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={12}
                  autoComplete="given-name"
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-2 font-medium">Last name</span>
                <input
                  className="input input-bordered w-full rounded-xl"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control">
                <span className="label-text mb-2 font-medium">Age</span>
                <input
                  className="input input-bordered w-full rounded-xl"
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min={18}
                  max={90}
                  inputMode="numeric"
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-2 font-medium">Gender</span>
                <select
                  className="select select-bordered w-full rounded-xl"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">Email</span>
              <input
                className="input input-bordered w-full rounded-xl"
                type="email"
                name="emailId"
                value={form.emailId}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">Password</span>
              <input
                className="input input-bordered w-full rounded-xl"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                aria-describedby="password-hint"
                required
              />
              <span id="password-hint" className="mt-1 text-xs opacity-60">
                Use at least 8 characters with uppercase, lowercase, number,
                and symbol.
              </span>
            </label>

            {errorMessage && (
              <p role="alert" className="text-sm text-error">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary mt-2 w-full rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;
