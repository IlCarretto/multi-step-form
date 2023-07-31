import React, { useState } from "react";
import { IFormData } from "../../App";
import { schemaStep1, schemaStep2 } from "./schema/schemaSteps";
import { ZodType } from "zod";
import { fromZodError } from "zod-validation-error";
import "./index.scss";

interface IProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: number[];
}

const StepForm = ({ currentStep, setCurrentStep, steps }: IProps) => {
  const [formData, setFormData] = useState<IFormData>({});

  const stepsData = [
    {
      step: 1,
      title: "Personal info",
      subtitle: "Please provide your name, email address, and phone number.",
      inputs: [
        { name: "name", label: "Name", type: "text" },
        { name: "email", label: "Email Address", type: "email" },
        { name: "phone", label: "Phone Number", type: "number" },
      ],
    },
    {
      step: 2,
      title: "Select your plan",
      subtitle: "You have the option of monthly or yearly billing.",
      inputs: [
        { name: "plan", label: "Arcade", type: "radio", value: "arcade" },
        { name: "plan", label: "Advanced", type: "radio", value: "advanced" },
        { name: "plan", label: "Pro", type: "radio", value: "pro" },
      ],
    },
    {
      step: 3,
      title: "Pick add-ons",
      subtitle: "Add-ons help enhance your gaming experience.",
      inputs: [
        { name: "online-service", label: "Online service", type: "checkbox" },
        { name: "larger-storage", label: "Larger storage", type: "checkbox" },
        {
          name: "customizable",
          label: "Customizable profile",
          type: "checkbox",
        },
      ],
    },
    {
      step: 4,
      title: "Finishing up",
      subtitle: "Double-check everything looks OK before confirming.",
      inputs: [],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevFormData) =>
      type === "radio"
        ? { ...prevFormData, [name]: value }
        : { ...prevFormData, [name]: value }
    );
  };

  const handleNextStep = () => {
    if (currentStep === 1 || currentStep === 2) {
      const currentFormSchema = formSchemas[currentStep];
      const results = currentFormSchema.safeParse(formData);
      if (!results.success) {
        console.log(fromZodError(results.error));
      }
    }
    setCurrentStep((prevStep) => prevStep + 1);
    console.log(formData);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const formSchemas: { [key: number]: ZodType<any> } = {
    1: schemaStep1,
    2: schemaStep2,
  };

  const handleFormSubmit = () => {
    const currentFormSchema = formSchemas[currentStep];
    try {
      const validateForm = currentFormSchema.parse(formData);
      console.log("Validated Data", validateForm);
    } catch (err) {
      console.log("Validation Err");
    }
  };

  const currentStepData = stepsData.find(
    (stepInfo) => stepInfo.step === currentStep
  );
  if (!currentStepData) {
    return null;
  }
  const { title, subtitle, inputs } = currentStepData;

  return (
    <div className="row">
      <div className="col-12 d-flex justify-content-center">
        <form className="form">
          <h1 className="title">{title}</h1>
          <p className="subtitle">{subtitle}</p>
          {inputs.map((input, index) => {
            const { type, name, label } = input;
            return (
              <div key={index} className="ms-input-group">
                <label htmlFor={name}>{label}</label>
                <input type={type} name={name} onChange={handleChange}></input>
              </div>
            );
          })}
          <div
            className={`btn-group ${
              currentStep === 1
                ? "justify-content-end"
                : "justify-content-between"
            }`}
          >
            {currentStep !== 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn-prev"
              >
                Go Back
              </button>
            )}
            {currentStep < steps.length && (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-next"
              >
                Next
              </button>
            )}
            {currentStep === steps.length && (
              <button
                type="submit"
                onSubmit={handleFormSubmit}
                className="btn-submit"
              >
                Confirm
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepForm;
