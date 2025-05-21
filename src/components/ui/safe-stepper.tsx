'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import { Check, X } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  optional?: boolean;
  completed?: boolean;
  error?: boolean;
}

interface SafeStepperProps {
  steps: Step[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (step: number) => void;
  className?: string;
  stepClassName?: string;
  activeStepClassName?: string;
  completedStepClassName?: string;
  errorStepClassName?: string;
  connectorClassName?: string;
  activeConnectorClassName?: string;
  completedConnectorClassName?: string;
  errorConnectorClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  nonLinear?: boolean;
}

/**
 * A hydration-safe stepper component that handles SSR and client-side rendering properly
 */
export function SafeStepper({
  steps,
  activeStep,
  orientation = 'horizontal',
  onChange,
  className,
  stepClassName,
  activeStepClassName,
  completedStepClassName,
  errorStepClassName,
  connectorClassName,
  activeConnectorClassName,
  completedConnectorClassName,
  errorConnectorClassName,
  labelClassName,
  descriptionClassName,
  iconClassName,
  nonLinear = false,
}: SafeStepperProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle step click
  const handleStepClick = (index: number) => {
    if (!nonLinear && index > activeStep) return;
    onChange?.(index);
  };
  
  // Check if step is active
  const isStepActive = (index: number) => {
    return activeStep === index;
  };
  
  // Check if step is completed
  const isStepCompleted = (index: number, step: Step) => {
    if (step.completed !== undefined) return step.completed;
    return nonLinear ? false : index < activeStep;
  };
  
  // Check if step has error
  const hasStepError = (step: Step) => {
    return step.error === true;
  };
  
  // Get step icon
  const getStepIcon = (index: number, step: Step) => {
    if (step.icon) return step.icon;
    
    if (hasStepError(step)) {
      return <X className="h-5 w-5" />;
    }
    
    if (isStepCompleted(index, step)) {
      return <Check className="h-5 w-5" />;
    }
    
    return <span>{index + 1}</span>;
  };
  
  // Get step classes
  const getStepClasses = (index: number, step: Step) => {
    const isActive = isStepActive(index);
    const isCompleted = isStepCompleted(index, step);
    const isError = hasStepError(step);
    
    return [
      'relative',
      isActive ? `${activeStepClassName || ''}` : '',
      isCompleted ? `${completedStepClassName || ''}` : '',
      isError ? `${errorStepClassName || ''}` : '',
      stepClassName || '',
    ].filter(Boolean).join(' ');
  };
  
  // Get connector classes
  const getConnectorClasses = (index: number, step: Step) => {
    const isActive = activeStep > index;
    const isCompleted = isStepCompleted(index, step);
    const isError = hasStepError(step);
    
    return [
      orientation === 'horizontal' ? 'flex-1 border-t' : 'h-full border-l ml-4',
      isActive || isCompleted
        ? isError
          ? `border-red-500 ${errorConnectorClassName || ''}`
          : `border-blue-500 ${completedConnectorClassName || ''}`
        : `border-gray-300 dark:border-gray-700 ${connectorClassName || ''}`,
      isActive && !isCompleted && !isError ? `${activeConnectorClassName || ''}` : '',
    ].filter(Boolean).join(' ');
  };
  
  // Simple loading state for SSR
  const StepperSkeleton = () => (
    <div className={`${orientation === 'horizontal' ? 'flex' : 'flex flex-col'} ${className || ''}`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          {index < 2 && (
            <div className={`${orientation === 'horizontal' ? 'w-16 h-1' : 'h-16 w-1'} bg-gray-200 dark:bg-gray-700 mx-2`}></div>
          )}
        </div>
      ))}
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <StepperSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<StepperSkeleton />}>
      <div className={`${orientation === 'horizontal' ? 'flex' : 'flex flex-col'} ${className || ''}`}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className={getStepClasses(index, step)}>
              <div
                className={`flex ${
                  orientation === 'vertical' ? 'flex-col items-start' : 'items-center'
                }`}
              >
                {/* Step icon */}
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                    isStepActive(index)
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      : isStepCompleted(index, step)
                      ? 'bg-blue-500 text-white dark:bg-blue-600'
                      : hasStepError(step)
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  } ${
                    !nonLinear && index > activeStep
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  } ${iconClassName || ''}`}
                  onClick={() => handleStepClick(index)}
                >
                  {getStepIcon(index, step)}
                </div>
                
                {/* Step content */}
                {(step.label || step.description) && (
                  <div className={`${orientation === 'vertical' ? 'mt-2' : 'ml-2'}`}>
                    <div
                      className={`text-sm font-medium ${
                        isStepActive(index)
                          ? 'text-gray-900 dark:text-white'
                          : isStepCompleted(index, step)
                          ? 'text-blue-600 dark:text-blue-300'
                          : hasStepError(step)
                          ? 'text-red-600 dark:text-red-300'
                          : 'text-gray-500 dark:text-gray-400'
                      } ${labelClassName || ''}`}
                    >
                      {step.label}
                      {step.optional && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          (Optional)
                        </span>
                      )}
                    </div>
                    
                    {step.description && (
                      <div
                        className={`text-xs text-gray-500 dark:text-gray-400 ${descriptionClassName || ''}`}
                      >
                        {step.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Connector */}
            {index < steps.length - 1 && (
              <div className={getConnectorClasses(index, step)}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </ClientOnly>
  );
}
