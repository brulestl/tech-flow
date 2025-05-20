'use client';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How secure is my code?',
    a: 'All data is encrypted in transit and at rest; you always control which repos to share.'
  },
  {
    q: 'Which languages are supported?',
    a: 'JavaScript, TypeScript, Python, Go, Ruby and Java.'
  },
  {
    q: 'Can I self-host?',
    a: 'Yes—on-premise and private-cloud deployments are available for Enterprise.'
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. Free for up to 3 users and 5 repos.'
  }
];

export default function SkoopFAQ() {
  return (
    <section id="faq" className="max-w-2xl mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-10 text-center">FAQs</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.q} value={`faq-${i}`}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
} 