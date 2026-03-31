"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectFormModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [isOngoing, setIsOngoing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // form state
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    purpose: "",
    startDate: "",
    endDate: "",
    url: "",
    description: "",
  });

  if (!isOpen) return null;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const isStepValid = () => {
  if (step === 1) {
    return formData.title && formData.role && formData.purpose;
  }
  if (step === 2) {
  return formData.startDate && (isOngoing || formData.endDate);
}
  if (step === 3) {
    return formData.url && formData.description;
  }
  return true;
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[750px] bg-white rounded-xl shadow-xl flex overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-1/3 bg-yellow-500 flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            📋
          </div>
          <h2 className="text-lg font-semibold text-white font-semibold font-semibold">Add Projects</h2>
          <p className="text-sm text-white font-semibold font-semibold mt-3">
            Include your professional or academic projects.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-2/3 p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">Project</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">
  ✕
</button>
          </div>
          
          <p className="text-sm text-gray-600 font-medium mb-2">
            Step {step} of 4
          </p>

          {/* PROGRESS */}
          <div className="w-full bg-gray-200 h-1 rounded mb-6">
            <div
              className="h-1 bg-green-500 rounded"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">

  <div>
    <label className="text-sm font-medium">Project Title *</label>
    <input
      name="title"
      placeholder="e.g. AI Career Recommender"
      onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>

  <div>
    <label className="text-sm font-medium">Your Role *</label>
    <input
      name="role"
      placeholder="e.g. ML Developer"
      onChange={handleChange}
className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>

  <div>
    <label className="text-sm font-medium">Project Purpose *</label>
    <select
      name="purpose"
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">Select Purpose</option>
      <option>Industrial</option>
      <option>Academic</option>
      <option>Personal</option>
      <option>Other</option>
    </select>
  </div>

</div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <input
                type="date"
                name="startDate"
                onChange={handleChange}
className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {!isOngoing && (
              <input
                type="date"
                name="endDate"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            )}
              <label className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <input
                type="checkbox"
                checked={isOngoing}
                onChange={() => setIsOngoing(!isOngoing)}
              />
                Currently ongoing
              </label>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <input
                name="url"
                placeholder="Project URL"
                onChange={handleChange}
               className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* STEP 4 (DONE) */}
          {step === 4 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3 text-green-600">
             All Done
            </h2>
            <p className="text-gray-600">
              Click Submit to save details or Previous to edit.
            </p>
          </div>
        )}

{showSuccess && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div className="bg-white rounded-xl shadow-xl p-6 w-[350px] text-center">

      <p className="text-gray-800 mb-4">
        Project has been added successfully
      </p>

      <button
        onClick={() => {
          setShowSuccess(false);
          onClose(); // close main modal also
        }}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-medium"
      >
        Close
      </button>

    </div>
  </div>
)}

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Previous
              </button>
            )}
          
            {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`ml-auto px-5 py-2 rounded-lg text-white font-semibold ${
                isStepValid()
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Next
            </button>
            ) : (
              <button
                onClick={() => setShowSuccess(true)}
                className="ml-auto px-5 py-2 bg-green-500 text-white font-semibold rounded-lg"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}