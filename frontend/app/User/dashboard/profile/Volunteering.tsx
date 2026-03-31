"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function AddVolunteer({ isOpen, onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    organization: "",
    role: "",
    startDate: "",
    endDate: "",
    ongoing: false,
    cause: "",
    description: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const isValid = () => {
    if (step === 1) return form.organization && form.role;
    if (step === 2) return form.startDate;
    if (step === 3) return form.cause && form.description;
    return true;
  };

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="bg-white rounded-2xl w-[820px] flex shadow-2xl overflow-hidden"
  >

    {/* LEFT PANEL */}
    <div className="w-1/3 bg-yellow-400 text-white p-8 flex flex-col justify-center text-center">
      <h2 className="text-2xl font-bold mb-2">Volunteering Experience</h2>
      <p className="text-sm opacity-90">
        List your volunteering activities and contributions.
      </p>
    </div>

    {/* RIGHT PANEL */}
    <div className="w-2/3 p-8 relative text-black">

      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute right-5 top-4 text-gray-500 hover:text-black text-lg"
      >
        ✕
      </button>

      {/* STEP */}
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Step {step} of 3
      </h2>

      {/* PROGRESS */}
      <div className="w-full bg-gray-200 h-2 rounded mb-6">
        <div
          className="bg-green-500 h-2 rounded"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Organization *
            </label>
            <input
              name="organization"
              placeholder="e.g. NGO, Company"
              value={form.organization}
              onChange={handleChange}
             className="w-full p-3 rounded-lg border border-gray-300 
bg-white text-black 
placeholder-gray-400 
focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Role *
            </label>
            <input
              name="role"
              placeholder="e.g. Volunteer Teacher"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 
bg-white text-black 
placeholder-gray-400 
focus:outline-none focus:ring-2 focus:ring-green-500"/>
          </div>

        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">

          <label className="flex items-center gap-3 cursor-pointer">
  
  <input
    type="checkbox"
    name="ongoing"
    checked={form.ongoing}
    onChange={handleChange}
    className="h-5 w-5 accent-green-500 cursor-pointer"
  />

  <span className="text-gray-700 text-sm font-medium">
    Currently ongoing
  </span>

</label>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
             className="w-full p-3 rounded-lg border border-gray-300 
bg-white text-black 
placeholder-gray-400 
focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {!form.ongoing && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
           className="w-full p-3 rounded-lg border border-gray-300 
bg-white text-black 
placeholder-gray-400 
focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Cause *
            </label>
            <select
              name="cause"
              value={form.cause}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg mt-1"
            >
              <option value="">Select Cause</option>
              <option>Arts And Culture</option>
              <option>Children</option>
              <option>Animal Welfare</option>
              <option>Civil Rights Abd Social Rights</option>
              <option>Economic Empowerment</option>
              <option>Education</option>
              <option>Environment</option>
              <option>Human Rights</option>
              <option>Disaster And Humaterian Relif</option>
              <option>Politics</option>
              <option>Poverty Evaluation Programmers</option>
              <option>Sciend And Technology</option>
              <option>Veteran Supports</option>
              <option>Social Services</option>
              <option>Health</option>
              <option>Others</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Explain your contribution..."
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black" 
            />
          </div>

        </div>
      )}

      {/* BUTTONS */}
      <div className="flex justify-between mt-8">

        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-40"
        >
          Previous
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!isValid()}
            className={`px-6 py-2 rounded-lg text-white ${
              isValid()
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!isValid()}
            className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
          >
            Submit
          </button>
        )}
      </div>

    </div>
  </motion.div>
</div>
  );
}