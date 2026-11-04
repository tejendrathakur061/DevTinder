import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/Constants";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    gender: user.gender,
    about: user.about,
    imgURL: user.imgURL,
    skills: user.skills || [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    const alreadyAdded = formData.skills.some(
      (existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase(),
    );

    if (skill && !alreadyAdded) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          ...formData,
          age: Number(formData.age),
        },
        {
          withCredentials: true,
        },
      );

      const savedUser = res.data.data;
      dispatch(addUser(savedUser));
      setFormData({
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        age: String(savedUser.age ?? ""),
        gender: savedUser.gender,
        about: savedUser.about,
        imgURL: savedUser.imgURL,
        skills: savedUser.skills || [],
      });
      setSuccessMessage("Profile saved");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      const response = error.response?.data;
      const message =
        response?.message ||
        response ||
        error.message ||
        "Could not update your profile. Please try again.";
      setErrorMessage(
        typeof message === "string"
          ? message.replace(/^ERROR\s*:\s*/, "")
          : "Could not update your profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-8 px-4 lg:flex-row lg:items-start">
      <div className="card w-full max-w-lg rounded-xl bg-base-300">
        <div className="card-body p-6">
          <h2 className="card-title justify-center mb-4">Edit Profile</h2>

          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <p role="alert" className="alert alert-error mb-4">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p
                role="status"
                className="alert alert-success fixed right-4 top-20 z-60 w-auto shadow-lg"
              >
                {successMessage}
              </p>
            )}
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input w-full rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input w-full rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  min="18"
                  max="90"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="input w-full rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="select w-full rounded-xl"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">About</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className="textarea w-full rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Image URL</label>
                <input
                  type="url"
                  name="imgURL"
                  value={formData.imgURL}
                  onChange={handleChange}
                  className="input w-full rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill"
                    className="input w-full rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn btn-primary rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="badge badge-outline cursor-pointer"
                    >
                      {skill} ×
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="btn btn-primary w-full rounded-xl"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card w-full max-w-sm bg-base-300 shadow-xl">
        <figure>
          <img
            src={
              formData.imgURL ||
              `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}`
            }
            alt={`${formData.firstName} ${formData.lastName}`}
            className="h-64 w-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {formData.firstName} {formData.lastName}
          </h2>
          <p>{formData.about || "No bio available"}</p>
          <p>Age: {formData.age || "Not set"}</p>
          <p>Gender: {formData.gender || "Not set"}</p>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span key={skill} className="badge badge-outline">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
