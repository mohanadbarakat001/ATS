import React from 'react';
import { CheckCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { AppView } from '../types';

interface LandingProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative isolate pt-14 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Beat the ATS. <span className="text-blue-600">Land the Interview.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Stop getting rejected by robots. Our AI analyzes your resume against your target job description to boost your match score, rewrite your bullets, and generate a tailored cover letter in seconds.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={onGetStarted}
                className="rounded-full bg-blue-600 px-8 py-3.5 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all flex items-center"
              >
                Fix My Resume Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a href="#pricing" className="text-sm font-semibold leading-6 text-slate-900">
                View Pricing <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Proven Results</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to apply with confidence
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: 'ATS Optimization',
                  description: 'We restructure your resume and inject missing keywords naturally so you score 90%+ on automated screeners.',
                  icon: Zap,
                },
                {
                  name: 'Tailored Cover Letters',
                  description: 'Generate a specific, confident cover letter that references your actual experience and the company\'s needs.',
                  icon: FileTextIcon,
                },
                {
                  name: 'Safe & Truthful',
                  description: 'We never invent facts. We refine your wording and suggest placeholders for metrics you need to add.',
                  icon: ShieldCheck,
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                    <feature.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Simple Pricing</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              No monthly subscriptions. Pay for what you use.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-md rounded-3xl ring-1 ring-slate-200 bg-white lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Single Fix</h3>
              <p className="mt-6 text-base leading-7 text-slate-600">
                Perfect for that one dream job you really want to land.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-blue-600">What's included</h4>
                <div className="h-px flex-auto bg-slate-100" />
              </div>
              <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                {['ATS Resume Rewrite', 'Tailored Cover Letter', 'Keyword Match Report', 'LinkedIn Summary', 'DOCX & PDF Download'].map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-slate-50 py-10 text-center ring-1 ring-inset ring-slate-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-slate-600">One-time payment</p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-slate-900">$0.99</span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-slate-600">USD</span>
                  </p>
                  <button
                    onClick={onGetStarted}
                    className="mt-10 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Get Access
                  </button>
                  <p className="mt-6 text-xs leading-5 text-slate-600">
                    Invoices and receipts available for easy company reimbursement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const FileTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);
