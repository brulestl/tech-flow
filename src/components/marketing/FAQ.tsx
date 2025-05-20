'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
export default function FAQ() {
  const qas = [
    { q: 'Is there a free tier?', a: 'Yes – import up to 50 resources for free.' },
    { q: 'Can I cancel anytime?', a: 'Absolutely, no strings attached.' },
    { q: 'Is my data private?', a: '100 %. We never sell your knowledge.' },
    { q: 'Do you have a mobile app?', a: 'iOS & Android launch Q3 2025.' },
  ];
  return (
    <section id="faq" className="bg-muted bg-opacity-30 px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold">FAQs</h2>
        <Accordion type="single" collapsible className="w-full">
          {qas.map(({ q, a }) => (
            <AccordionItem value={q} key={q}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
