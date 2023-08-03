import React from "react";
import "./index.scss";
import { useErrorsContext } from "../../context/ErrorContext";

interface IProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: number[];
}

const StepSidebar = ({ currentStep, setCurrentStep, steps }: IProps) => {
  const stepTitles = ["YOUR INFO", "SELECT PLAN", "ADD-ONS", "SUMMARY"];
  const { errors } = useErrorsContext();

  return (
    <div className="step-sidebar">
      {steps.map((step, index) => {
        const errorsSteps = Object.keys(errors).map(Number);
        const hasError = errorsSteps.includes(step);
        const circleError = hasError ? "circle-error" : "";
        return (
          <div
            onClick={() => setCurrentStep(step)}
            key={index}
            className={`step ${currentStep === step ? "active" : ""}`}
          >
            <div className={`circle ${circleError}`}>
              <span>{step}</span>
            </div>
            <div className="step-title">
              <span>STEP {step}</span>
              <h5>{stepTitles[index]}</h5>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepSidebar;
