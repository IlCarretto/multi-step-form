import React, { useState, useEffect } from "react";
import { IFormData } from "../../App";
import { schemaStep1, schemaStep2 } from "./schema/schemaSteps";
import { ZodType } from "zod";
import { fromZodError } from "zod-validation-error";
import "./index.scss";
import { useForm } from "react-hook-form";

interface IProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: number[];
}

interface IStepsData {
  step: number;
  title: string;
  subtitle: string;
  inputs: {
    name: string;
    label: string;
    type: string;
    value: string;
    monthlyPrice?: number;
    yearlyPrice?: number;
    id?: string;
    subtext?: string;
  }[];
}

const StepForm = ({ currentStep, setCurrentStep, steps }: IProps) => {
  const [formData, setFormData] = useState<IFormData>({});
  const [errors, setErrors] = useState({});
  const [isMonthly, setIsMonthly] = useState(true);

  const stepsData: IStepsData[] = [
    {
      step: 1,
      title: "Personal info",
      subtitle: "Please provide your name, email address, and phone number.",
      inputs: [
        { name: "name", id: "name", label: "Name", type: "text", value: "" },
        {
          name: "email",
          id: "email",
          label: "Email Address",
          type: "email",
          value: "",
        },
        {
          name: "phone",
          id: "phone",
          label: "Phone Number",
          type: "number",
          value: "",
        },
      ],
    },
    {
      step: 2,
      title: "Select your plan",
      subtitle: "You have the option of monthly or yearly billing.",
      inputs: [
        {
          name: "plan",
          id: "arcade",
          label: "Arcade",
          monthlyPrice: 9,
          yearlyPrice: 90,
          type: "radio",
          value: "arcade",
        },
        {
          name: "plan",
          id: "advanced",
          label: "Advanced",
          monthlyPrice: 12,
          yearlyPrice: 120,
          type: "radio",
          value: "advanced",
        },
        {
          name: "plan",
          id: "pro",
          label: "Pro",
          monthlyPrice: 15,
          yearlyPrice: 150,
          type: "radio",
          value: "pro",
        },
      ],
    },
    {
      step: 3,
      title: "Pick add-ons",
      subtitle: "Add-ons help enhance your gaming experience.",
      inputs: [
        {
          name: "online-service",
          id: "online-service",
          label: "Online service",
          subtext: "Access to multiplayer games",
          monthlyPrice: 1,
          yearlyPrice: 10,
          type: "checkbox",
          value: "online-service",
        },
        {
          name: "larger-storage",
          id: "larger-storage",
          label: "Larger storage",
          subtext: "Extra 1TB of cloud save",
          monthlyPrice: 2,
          yearlyPrice: 20,
          type: "checkbox",
          value: "larger-storage",
        },
        {
          name: "customizable",
          id: "customizable",
          label: "Customizable profile",
          subtext: "Custom theme on your profile",
          monthlyPrice: 2,
          yearlyPrice: 20,
          type: "checkbox",
          value: "customizable",
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
    if (type === "number") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: +value,
      }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 || currentStep === 2) {
      const currentFormSchema = formSchemas[currentStep];
      const results = currentFormSchema.safeParse(formData);
      if (!results.success) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [currentStep]: results.error.formErrors.fieldErrors,
        }));
      }
    }
    setCurrentStep((prevStep) => prevStep + 1);
    console.log(formData);
  };

  useEffect(() => {
    console.log(errors);
    if (errors && errors["1"]) {
      console.log(errors["1"]["name"][0]);
    }
  }, [errors]);

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const formSchemas: { [key: number]: ZodType<any> } = {
    1: schemaStep1,
    2: schemaStep2,
  };

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
          <div className="form-main">
            <h1 className="title">{title}</h1>
            <p className="subtitle">{subtitle}</p>
            {inputs.map((input, index) => {
              const {
                type,
                name,
                label,
                value,
                monthlyPrice,
                yearlyPrice,
                id,
                subtext,
              } = input;
              console.log(errors);
              console.log(currentStep);
              return (
                <>
                  {!!errors && errors[currentStep] && (
                    <p>{errors[currentStep][name][0]}</p>
                  )}
                  <div
                    key={index}
                    className={`ms-input-group ${
                      type === "radio" ? "d-inline-block" : ""
                    } ${id === "advanced" || id === "pro" ? "ms-3" : ""}`}
                  >
                    <label
                      className={`${
                        type === "radio"
                          ? "radio-label"
                          : type === "checkbox"
                          ? "check-label"
                          : ""
                      }`}
                      htmlFor={id}
                    >
                      {type === "radio" ? (
                        <>
                          <div className="label-img">
                            <img
                              width="50"
                              height="50"
                              src={`../../../public/icon-${label.toLocaleLowerCase()}.svg`}
                              alt={`${label}-icon`}
                            />
                          </div>
                          <div className="label-content">
                            <h5>{label}</h5>
                            <span>
                              $ {isMonthly ? monthlyPrice : yearlyPrice}/
                              {isMonthly ? "mo" : "yr"}
                            </span>
                            {!isMonthly && <small>2 months free</small>}{" "}
                          </div>
                        </>
                      ) : type === "checkbox" ? (
                        <div className="checkbox-wrapper">
                          <div className="checkbox">
                            <input
                              id={id}
                              type={type}
                              name={name}
                              value={value}
                              onChange={handleChange}
                            ></input>
                          </div>
                          <div className="checkbox-title">
                            <h6>{label}</h6>
                            <span>{subtext}</span>
                          </div>
                          <div className="checkbox-footer">
                            <span>
                              $ {isMonthly ? monthlyPrice : yearlyPrice}/
                              {isMonthly ? "mo" : "yr"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>{label}</>
                      )}
                    </label>
                    {type === "radio" ? (
                      <input
                        id={id}
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleChange}
                      />
                    ) : type !== "checkbox" ? (
                      <input
                        id={id}
                        type={type}
                        name={name}
                        onChange={handleChange}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </>
              );
            })}
            {currentStep === 2 && (
              <div className="switch-tab">
                <span>Monthly</span>
                <button
                  type="button"
                  className={`switch-button ${isMonthly ? "monthly" : ""}`}
                  onClick={() => setIsMonthly(!isMonthly)}
                ></button>
                <span>Yearly</span>
              </div>
            )}
          </div>
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
