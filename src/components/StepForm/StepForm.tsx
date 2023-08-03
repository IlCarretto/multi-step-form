import React, { useState, useRef } from "react";
import { schemaStep1, schemaStep2 } from "./schema/schemaSteps";
import { ZodType } from "zod";
import "./index.scss";
import Input from "../Input/Input";
import { formatValue } from "../../utils/formatValue";
import { calculateTotalPrice } from "../../utils/calculateTotalPrice";
import { useErrorsContext } from "../../context/ErrorContext";

interface NestedObject {
  [key: string]: number | string | NestedObject;
}

export interface IFormData {
  [key: string]: number | string | NestedObject;
}

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
  const { errors, setErrors } = useErrorsContext();
  const [isMonthly, setIsMonthly] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState("");
  const formRef = useRef<HTMLDivElement | null>(null);
  const btnGroupRef = useRef<HTMLDivElement | null>(null);
  const thankYouRef = useRef<HTMLDivElement | null>(null);
  const stepsData: IStepsData[] = [
    {
      step: 1,
      title: "Personal info",
      subtitle: "Please provide your name, email address, and phone number.",
      inputs: [
        { name: "name", id: "name", label: "Name *", type: "text", value: "" },
        {
          name: "email",
          id: "email",
          label: "Email Address *",
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
    const { name, value, type, id } = e.target;
    const fixedValue =
      type === "radio" || type === "checkbox"
        ? {
            serviceName: formatValue(id),
            price: +value,
          }
        : type === "number"
        ? +value
        : value;
    if (type === "number") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: fixedValue,
      }));
    } else if (type === "radio" || type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: fixedValue,
      }));
      if (type === "radio") {
        setSelectedPlan(id);
      }
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: fixedValue }));
    }
    if (currentStep === 1 || currentStep === 2) {
      const currentFormSchema = formSchemas[currentStep];
      const results = currentFormSchema.safeParse({
        ...formData,
        [name]: fixedValue,
      });
      if (!results.success) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [currentStep]: {
            ...results.error.formErrors.fieldErrors,
            [name]: results.error.formErrors.fieldErrors[name],
          },
        }));
      } else {
        setErrors({});
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 || currentStep === 2) {
      const currentFormSchema = formSchemas[currentStep];
      const results = currentFormSchema.safeParse(formData);
      if (!results.success) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [currentStep]: results.error.formErrors.fieldErrors,
        }));
      } else {
        setErrors({});
      }
    }
    setCurrentStep((prevStep) => prevStep + 1);
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

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Validated Data", formData);
    if (formRef.current && thankYouRef.current && btnGroupRef.current) {
      formRef.current.classList.add("hidden");
      btnGroupRef.current.classList.add("hidden");
      thankYouRef.current.classList.remove("d-none");
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
          <div className="form-main" ref={formRef}>
            <h1 className="title">{title}</h1>
            <p className="subtitle">{subtitle}</p>
            {inputs.map((input, index) => {
              return (
                <>
                  <Input
                    key={index}
                    {...input}
                    isMonthly={isMonthly}
                    onChange={handleChange}
                    value={formData || ""}
                    errors={errors}
                    currentStep={currentStep}
                    selectedPlan={selectedPlan}
                  />
                  {((index === 2 && currentStep === 2) || currentStep !== 2) &&
                    !!errors &&
                    (errors as any)[currentStep] &&
                    (errors as any)[currentStep][input.name] && (
                      <p className="error">
                        {(errors as any)[currentStep][input.name][0]}
                      </p>
                    )}
                </>
              );
            })}
            {currentStep === 2 && (
              <div className="switch-tab">
                <span>Monthly</span>
                <input
                  id="switch-sub"
                  type="checkbox"
                  value=""
                  className={`switch-button ${isMonthly ? "monthly" : ""}`}
                  onChange={() => setIsMonthly(!isMonthly)}
                />
                <label htmlFor="switch-sub"></label>
                <span>Yearly</span>
              </div>
            )}
            {currentStep === steps.length && (
              <>
                <div className="summary">
                  {!!formData.plan && (formData as any).plan.serviceName ? (
                    <>
                      <div>
                        <div className="service">
                          <h5>
                            {(formData as any).plan.serviceName}
                            {isMonthly ? " (Monthly)" : " (Yearly)"}
                          </h5>
                          <span onClick={() => setCurrentStep(2)}>Change</span>
                        </div>
                        <div className="price">
                          <span className="plan-price">
                            {`$${(formData as any).plan.price}/`}
                            {isMonthly ? "mo" : "yr"}
                          </span>
                        </div>
                      </div>
                      <div className="line"></div>
                      {(formData as any)["online-service"] && (
                        <div>
                          <div className="service">
                            <p>
                              {(formData as any)["online-service"].serviceName}
                            </p>
                          </div>
                          <div className="price">
                            <span>
                              {`$${(formData as any)["online-service"].price}/`}
                              {isMonthly ? "mo" : "yr"}
                            </span>
                          </div>
                        </div>
                      )}
                      {(formData as any)["larger-storage"] && (
                        <div>
                          <div className="service">
                            <p>
                              {(formData as any)["larger-storage"].serviceName}
                            </p>
                          </div>
                          <div className="price">
                            <span>
                              {`$${(formData as any)["larger-storage"].price}/`}
                              {isMonthly ? "mo" : "yr"}
                            </span>
                          </div>
                        </div>
                      )}
                      {(formData as any)["customizable"] && (
                        <div>
                          <div className="service">
                            <p>
                              {(formData as any)["customizable"].serviceName}
                            </p>
                          </div>
                          <div className="price">
                            <span>
                              {`$${(formData as any)["customizable"].price}/`}
                              {isMonthly ? "mo" : "yr"}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    "Enter your plan first"
                  )}
                </div>
                <div className="total">
                  <p>
                    Total
                    {isMonthly ? " (per month)" : " (per year)"}
                  </p>
                  <h4>
                    {`$${calculateTotalPrice(formData)}/`}
                    {isMonthly ? "mo" : "yr"}
                  </h4>
                </div>
              </>
            )}
          </div>
          <div className="thank-you-page d-none" ref={thankYouRef}>
            <img src="icon-thank-you.svg" alt="Form Submitted Check" />
            <h1 className="mt-4">Thank you!</h1>
            <p className="text-center">
              Thanks for confirming your subscription! We hope you have fun
              using our platform. If you ever need support, please feel free to
              email us at support@loremgaming.com
            </p>
          </div>
          <div
            ref={btnGroupRef}
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
                disabled={
                  !(
                    errors &&
                    Object.entries(errors).length === 0 &&
                    !!formData.plan &&
                    (formData as any).plan.serviceName
                  )
                }
                type="button"
                onClick={handleFormSubmit}
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
