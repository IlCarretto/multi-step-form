import React, { useState } from "react";
import StepSidebar from "./components/StepSidebar/StepSidebar";
import StepForm from "./components/StepForm/StepForm";

function App() {
  const steps = [1, 2, 3, 4];
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="App">
      <main>
        <StepSidebar
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          steps={steps}
        />
        <StepForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          steps={steps}
        />
      </main>
    </div>
  );
}

export default App;
