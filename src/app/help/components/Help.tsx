import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from 'lucide-react';

const HelpPage = () => {
  const faqs = [
    {
      question: "How long should it take to get a report?",
      answer: "Most reports are generated within 10 minutes. Complex reports with large datasets may take up to 30 minutes."
    },
    {
      question: "How will I know when a report is done?",
      answer: "You will receive a notification in the upper right-hand corner of the dashboard when your report is ready. You can also check the status of your reports in the Reports Dashboard."
    },
    {
      question: "How do I access old reports?",
      answer: "You can access all your previous reports from the Reports Dashboard. Use the date filter to find specific reports, or use the search function to find reports by name or content."
    },
    {
      question: "What do the different property classifications mean?",
      answer: "Properties are classified as Residential, Commercial, Industrial, or Mixed Use. These classifications help organize and filter properties based on their primary purpose and zoning regulations."
    },
    {
      question: "How do I export data from the dashboard?",
      answer: "Click the 'Export' button in the top right corner of any data table. You can choose to export as CSV, Excel, or PDF format."
    },
    {
      question: "What does the heat map show?",
      answer: "The heat map displays property density and value concentrations across different geographical areas. Red areas indicate higher concentration or value, while blue areas indicate lower concentration."
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Help Center</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-slate-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-white mb-2">Quick Start Guide</h2>
            <p className="text-gray-300">
              Welcome to the Property Dashboard! This help center contains answers to common questions
              and guides to help you make the most of the dashboard features.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-slate-700 rounded-md px-4"
              >
                <AccordionTrigger className="text-gray-200 hover:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="bg-slate-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-white mb-2">Still Need Help?</h2>
            <p className="text-gray-300">
              Contact our support team at support@propertydashboard.com or call us at
              (555) 123-4567 during business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
