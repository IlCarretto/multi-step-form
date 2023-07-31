import React from "react";
import "./index.scss";

interface IProps {
  currentStep: number;
  steps: number[];
}

const StepSidebar = ({ currentStep, steps }: IProps) => {
  const stepTitles = ["YOUR INFO", "SELECT PLAN", "ADD-ONS", "SUMMARY"];

  return (
    <div className="step-sidebar">
      {steps.map((step, index) => {
        return (
          <div
            key={index}
            className={`step ${currentStep === step ? "active" : ""}`}
          >
            <div className="circle">
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
