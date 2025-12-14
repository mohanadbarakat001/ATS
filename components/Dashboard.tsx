import React, { useState } from 'react';
import { Upload, FileText, Check, Loader2, AlertTriangle, ArrowRight, ArrowLeft, Target } from 'lucide-react';
import { WizardStep, UserConfig, OptimizationResult } from '../types';
import { generateOptimizedContent } from '../services/geminiService';
import { ResultsView } from './ResultsView';

interface DashboardProps {
  onSaveToHistory: (result: OptimizationResult) => void;
}

const NICHES: Record<string, string[]> = {
  "Software Engineering": ["Frontend", "Backend", "Full Stack", "AI/ML", "DevOps", "Mobile", "Game Dev", "Cybersecurity", "Data Engineering"],
  "Marketing": ["Digital Marketing", "Content Strategy", "SEO/SEM", "Product Marketing", "Brand Management", "Social Media"],
  "Finance": ["Investment Banking", "Corporate Finance", "FinTech", "Accounting", "Wealth Management", "Private Equity"],
  "Healthcare": ["Nursing", "Administration", "Medical Technology", "Pharmaceuticals", "Public Health"],
  "Sales": ["B2B SaaS", "Enterprise", "Retail", "Account Management", "Business Development"],
  "Product Management": ["B2B", "B2C", "Technical PM", "Growth PM"],
  "Other": []
};

export const Dashboard: React.FC<DashboardProps> = ({ onSaveToHistory }) => {
  const [step, setStep] = useState<WizardStep>(WizardStep.UPLOAD);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [config, setConfig] = useState<UserConfig>({ 
    seniority: 'Junior', 
    tone: 'Professional',
    primaryNiche: 'Software Engineering',
    subNiche: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const handleNext = async () => {
    if (step === WizardStep.CONFIG) {
        setStep(WizardStep.PROCESSING);
        setLoading(true);
        setError(null);
        try {
            const data = await generateOptimizedContent(resumeText, jobDescription, config);
            const newResult: OptimizationResult = {
                id: crypto.randomUUID(),
                createdAt: Date.now(),
                originalResumeText: resumeText,
                jobDescription,
                optimizedResume: data.resume,
                coverLetter: data.coverLetter,
                linkedinSummary: data.linkedinSummary,
                analysis: data.analysis,
                targetRole: data.targetRole
            };
            setResult(newResult);
            onSaveToHistory(newResult);
            setStep(WizardStep.RESULTS);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            setStep(WizardStep.CONFIG);
        } finally {
            setLoading(false);
        }
    } else {
        setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const isStepValid = () => {
      if (step === WizardStep.UPLOAD) return resumeText.length > 50;
      if (step === WizardStep.JOB_DETAILS) return jobDescription.length > 100;
      return true;
  };

  if (step === WizardStep.RESULTS && result) {
      return <ResultsView result={result} onReset={() => setStep(WizardStep.UPLOAD)} />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
            {['Upload CV', 'Job Details', 'Preferences', 'Results'].map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = step >= stepNum;
                return (
                    <div key={label} className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                        {label}
                    </div>
                )
            })}
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
                style={{ width: `${step === WizardStep.PROCESSING ? 75 : ((step - 1) / 3) * 100}%` }}
            />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
            {step === WizardStep.PROCESSING ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900">Optimizing your profile...</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">
                        Our AI is analyzing keywords, restructuring your bullets, and crafting your cover letter for {config.subNiche || config.primaryNiche}.
                    </p>
                </div>
            ) : (
                <>
                   {step === WizardStep.UPLOAD && (
                       <div className="space-y-6">
                           <div className="text-center">
                               <h2 className="text-2xl font-bold text-slate-900">Upload your Resume</h2>
                               <p className="text-slate-500 mt-1">Copy and paste the text content of your resume.</p>
                           </div>
                           
                           <div className="relative">
                               <textarea
                                   value={resumeText}
                                   onChange={(e) => setResumeText(e.target.value)}
                                   className="w-full h-64 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm bg-white text-slate-900 placeholder:text-slate-400"
                                   placeholder="Jane Doe
Email: jane@example.com
Experience:
Software Engineer at Tech Co..."
                               />
                               {resumeText.length > 0 && resumeText.length < 50 && (
                                   <div className="mt-2 text-red-500 text-sm flex items-center">
                                       <AlertTriangle className="w-4 h-4 mr-1" />
                                       Resume text is too short.
                                   </div>
                               )}
                           </div>
                           <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                               <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                               <p className="text-sm text-blue-800">
                                   <strong>Tip:</strong> For best results, ensure your contact info, experience, and education are clearly separated.
                               </p>
                           </div>
                       </div>
                   )}

                   {step === WizardStep.JOB_DETAILS && (
                       <div className="space-y-6">
                            <div className="text-center">
                               <h2 className="text-2xl font-bold text-slate-900">Target Job Description</h2>
                               <p className="text-slate-500 mt-1">Paste the full job description you want to apply for.</p>
                           </div>
                           <div className="relative">
                               <textarea
                                   value={jobDescription}
                                   onChange={(e) => setJobDescription(e.target.value)}
                                   className="w-full h-64 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm bg-white text-slate-900 placeholder:text-slate-400"
                                   placeholder="Job Title: Senior React Developer
Responsibilities:
- Build scalable web apps...
Requirements:
- 5+ years of experience..."
                               />
                               <div className="flex justify-between mt-2">
                                  <span className={`text-xs ${jobDescription.length < 100 ? 'text-red-500' : 'text-slate-400'}`}>
                                      {jobDescription.length} chars (min 100)
                                  </span>
                               </div>
                           </div>
                       </div>
                   )}

                   {step === WizardStep.CONFIG && (
                       <div className="space-y-8">
                           <div className="text-center">
                               <h2 className="text-2xl font-bold text-slate-900">Fine-tuning</h2>
                               <p className="text-slate-500 mt-1">Customize how the AI should rewrite your content.</p>
                           </div>

                           <div className="space-y-6">
                               {/* Niche Section */}
                               <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                   <div className="flex items-center mb-4 text-blue-800">
                                       <Target className="w-5 h-5 mr-2" />
                                       <h3 className="font-semibold">Niche Deep Dive</h3>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div>
                                           <label className="block text-sm font-medium text-slate-700 mb-2">Primary Industry</label>
                                           <select 
                                                value={config.primaryNiche}
                                                onChange={(e) => setConfig({ ...config, primaryNiche: e.target.value, subNiche: '' })}
                                                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 bg-white text-slate-900"
                                           >
                                               {Object.keys(NICHES).map(niche => (
                                                   <option key={niche} value={niche}>{niche}</option>
                                               ))}
                                           </select>
                                       </div>
                                       
                                       <div>
                                           <label className="block text-sm font-medium text-slate-700 mb-2">Sub-Niche / Specialization</label>
                                            {config.primaryNiche !== 'Other' && NICHES[config.primaryNiche].length > 0 ? (
                                                <select 
                                                    value={config.subNiche}
                                                    onChange={(e) => setConfig({ ...config, subNiche: e.target.value })}
                                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 bg-white text-slate-900"
                                                >
                                                    <option value="">Select a specialization...</option>
                                                    {NICHES[config.primaryNiche].map(sub => (
                                                        <option key={sub} value={sub}>{sub}</option>
                                                    ))}
                                                    <option value="General">General / Not Listed</option>
                                                </select>
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    value={config.subNiche}
                                                    onChange={(e) => setConfig({ ...config, subNiche: e.target.value })}
                                                    placeholder="e.g. Underwater Basket Weaving"
                                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 bg-white text-slate-900 placeholder:text-slate-400"
                                                />
                                            )}
                                            <p className="text-xs text-slate-500 mt-1">Helps AI prioritize specific industry jargon.</p>
                                       </div>
                                   </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 mb-2">Seniority Level</label>
                                       <div className="space-y-2">
                                           {['Intern', 'Junior', 'Mid', 'Senior'].map((level) => (
                                               <div 
                                                    key={level}
                                                    onClick={() => setConfig({...config, seniority: level as any})}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${config.seniority === level ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-blue-300'} bg-white`}
                                               >
                                                   <span className="text-sm font-medium text-slate-900">{level}</span>
                                                   {config.seniority === level && <Check className="w-4 h-4 text-blue-600" />}
                                               </div>
                                           ))}
                                       </div>
                                   </div>

                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 mb-2">Writing Tone</label>
                                       <div className="space-y-2">
                                           {['Professional', 'Confident', 'Direct'].map((tone) => (
                                               <div 
                                                    key={tone}
                                                    onClick={() => setConfig({...config, tone: tone as any})}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${config.tone === tone ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-blue-300'} bg-white`}
                                               >
                                                   <span className="text-sm font-medium text-slate-900">{tone}</span>
                                                   {config.tone === tone && <Check className="w-4 h-4 text-blue-600" />}
                                               </div>
                                           ))}
                                       </div>
                                   </div>
                               </div>
                           </div>
                           
                           {error && (
                               <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                                   <AlertTriangle className="w-5 h-5 mr-2" />
                                   {error}
                               </div>
                           )}
                       </div>
                   )}
                </>
            )}
        </div>

        {/* Footer Buttons */}
        {step !== WizardStep.PROCESSING && (
            <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-t border-slate-200">
                <button 
                    onClick={handleBack}
                    disabled={step === 1}
                    className="flex items-center text-slate-600 font-medium hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {step === WizardStep.CONFIG ? 'Generate Now' : 'Next Step'} <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};