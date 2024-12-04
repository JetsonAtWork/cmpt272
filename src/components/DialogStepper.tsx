import { condStr, rangeArray } from '@/utils/miscUtils';
import React from 'react';

export const DialogStepper = ({ currentStep, stepNames, onStepClicked }) => {
  return (
      <ul className='steps mt-2 mb-4 w-72'>
        {rangeArray(1, stepNames.length).map((stepIndex) => (
            <li
              key={stepIndex}
              onClick={() => onStepClicked(stepIndex)}
              className={`
                  step step-neutral 
                  ${condStr(currentStep >= stepIndex,'step-primary hover:cursor-pointer')}
                `}
              >
              {stepNames[stepIndex - 1]}
            </li>
        ))}
      </ul>
  );
};