import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  [
    "How long does a project usually take?",
    "Branding projects take 2-4 weeks depending on the scope. Website projects usually take between 1-4 weeks depending on custom features & the number of pages.",
  ],
  [
    "What makes the process different?",
    "We start development right away, working on designing & developing side by side, allowing you to see the project's evolution in real time, with faster feedback loops and earlier delivery.",
  ],
  [
    "Who will we work with?",
    "You will have a dedicated project lead as a single point of contact for ease of communication. They will manage the project end-to-end and ensure you are satisfied with the work.",
  ],
  [
    "What if I want changes or revisions?",
    "Each phase can have up to 2 revision phases. Projects don't move forward until you are satisfied, however, you must request any changes in a clear and specific manner.",
  ],
  [
    "Who owns the final work?",
    "You own the deliverables, source files, and implementation assets created for your project.",
  ],
];

export function FaqSection() {
  return (
    <section className="w-full">
      <div className="container mx-auto w-full px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold md:text-3xl text-center mb-8">
            FAQs
          </h2>
          <Accordion
            className=""
            type="single"
            collapsible
            defaultValue="item-0"
          >
            {faqs.map(([question, answer], index) => (
              <AccordionItem
                key={question}
                value={`item-${index}`}
                className="mb-2 rounded-xl bg-card px-4 z-1 relative border-border/95 border-solid border-[1px]"
              >
                <AccordionTrigger className="cursor-pointer py-3 hover:no-underline">
                  {question}
                </AccordionTrigger>
                <AccordionContent
                  data-hoverable
                  className="cursor-pointer text-muted-foreground"
                >
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
