import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="data-source">
          <AccordionTrigger>Where does this data come from?</AccordionTrigger>
          <AccordionContent className="text-left">
            Car makes, models, and mileage data is derived from the EPA's public API. ELM data (estimated lifetime miles) for each vehicle is derived from public sources online, and are an ESTIMATE, and will vary according to individual vehicle, and quality of care through its life. If you notice a significant deviance, or can cite a dependable source concerning ELM for a given vehicle, contact us at support@workpool.app. We'll review the information and update the calculator.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="older-cars">
          <AccordionTrigger>What if my car is older than 2013?</AccordionTrigger>
          <AccordionContent className="text-left">
            Car data from the EPA only reaches back to 2013. Beyond this, statistics and dat are less dependable. Still, you can get a good general estimate of the value grade of the vehicle. For cars older than 2013, we recommend just using year 2013.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="about">
          <AccordionTrigger>Who made this?</AccordionTrigger>
          <AccordionContent className="text-left">
            Carpool is a Workpool project. You can find the rest of our software, or have us build a custom app for your business or project at workpool.app
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
} 