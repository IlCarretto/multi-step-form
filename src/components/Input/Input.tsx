import React from "react";
import { IFormData } from "../StepForm/StepForm";

interface InputProps {
  type: string;
  name: string;
  label: string;
  value: IFormData;
  monthlyPrice?: number;
  yearlyPrice?: number;
  id?: string;
  subtext?: string;
  isMonthly: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: {};
  currentStep: number;
}

const Input = ({
  type,
  name,
  label,
  value,
  monthlyPrice,
  yearlyPrice,
  id,
  subtext,
  isMonthly,
  onChange,
  errors,
  currentStep,
}: InputProps) => {
  return (
    <div
      className={`ms-input-group ${type === "radio" ? "d-inline-block" : ""} ${
        id === "advanced" || id === "pro" ? "ms-3" : ""
      }`}
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
                src={`icon-${label.toLocaleLowerCase()}.svg`}
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
                value={isMonthly ? monthlyPrice : yearlyPrice || ""}
                onChange={onChange}
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
          value={isMonthly ? monthlyPrice : yearlyPrice || 1}
          onChange={onChange}
        />
      ) : type !== "checkbox" ? (
        <input
          className={
            errors &&
            (errors as any)[currentStep] &&
            (errors as any)[currentStep][name]
              ? "input-error"
              : ""
          }
          id={id}
          type={type}
          name={name}
          value={(value[name] as string) || ""}
          onChange={onChange}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Input;
