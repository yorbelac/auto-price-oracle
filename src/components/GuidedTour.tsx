import { useCallback, useState, useEffect } from 'react';
import Joyride, { CallBackProps, Step, STATUS, EVENTS } from 'react-joyride';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

interface GuidedTourProps {
  isFirstTimeUser: boolean;
}

export function GuidedTour({ isFirstTimeUser }: GuidedTourProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Only trigger the tour if the flag is set in localStorage
  useEffect(() => {
    if (localStorage.getItem('shouldShowGuidedTour') === 'true') {
      setRun(true);
      localStorage.removeItem('shouldShowGuidedTour');
    }
  }, []);

  const steps: Step[] = [
    {
      target: '.flex-1 .w-full.h-full.shadow-lg.border-blue-200',
      content: 'Start by entering car details here. Fill in the make, model, year, price, and mileage to calculate the value.',
      placement: 'bottom',
      disableBeacon: true,
      disableScrolling: true,
      floaterProps: {
        placement: 'bottom',
        offset: 20,
      },
    },
    {
      target: '.grid-cols-1.md\\:grid-cols-2 > div:nth-child(2) .shadow-lg.border-blue-200',
      content: 'After entering your car details, you\'ll see the analysis here, including value rating, remaining life, cost per mile, and EPA fuel economy data.',
      placement: 'bottom',
      disableScrolling: true,
      floaterProps: {
        placement: 'bottom',
        offset: 20,
      },
    },
    {
      target: '.mt-8',
      content: 'Your saved listings will appear here. You can save multiple cars to compare, sort them by different criteria, and organize them into lists.',
      placement: 'bottom',
      floaterProps: {
        placement: 'bottom',
        offset: 20,
      },
    },
    {
      target: '.flex.items-center.gap-2.flex-1',
      content: 'Create and manage different lists of cars you\'re interested in. Each list can be saved, shared, and loaded later.',
      placement: 'bottom',
      floaterProps: {
        placement: 'bottom',
        offset: 20,
      },
    },
    {
      target: 'button[title="Show Lists"], button[title="Show Listings"]',
      content: 'Click here to switch between your saved lists and the listings view. Use this to organize and access different sets of cars.',
      placement: 'bottom',
      floaterProps: {
        placement: 'bottom',
        offset: 20,
      },
    },
    {
      target: 'button[title="Start Guided Tour"]',
      content: 'You can always restart this guided tour by clicking the question mark button in the top right corner.',
      placement: 'bottom',
      floaterProps: {
        placement: 'bottom',
        offset: 20,
      },
    }
  ];

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, type, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      setStepIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + 1);
    }
  }, []);

  // Defensive cleanup: remove duplicate question mark buttons
  useEffect(() => {
    const container = document.getElementById('floating-actions');
    if (container) {
      const buttons = container.querySelectorAll('button[title="Start Guided Tour"]');
      if (buttons.length > 1) {
        // Remove all but the first
        buttons.forEach((btn, idx) => { if (idx > 0) btn.remove(); });
      }
    }
  });

  // Render the question mark button in the floating actions container
  const floatingActions = typeof window !== 'undefined' ? document.getElementById('floating-actions') : null;
  const questionMarkButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setStepIndex(0);
        setRun(true);
      }}
      title="Start Guided Tour"
      className="bg-white border border-gray-200 shadow-md hover:bg-gray-50 text-blue-700"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
    >
      <HelpCircle className="h-5 w-5" />
    </Button>
  );

  return (
    <>
      {floatingActions && createPortal(questionMarkButton, floatingActions)}
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        stepIndex={stepIndex}
        scrollOffset={200}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#1d4ed8', // blue-700
            backgroundColor: '#ffffff',
            textColor: '#1f2937', // gray-800
            arrowColor: '#ffffff',
            zIndex: 100,
          },
        }}
        floaterProps={{
          placement: 'top',
          offset: 20,
        }}
      />
    </>
  );
} 