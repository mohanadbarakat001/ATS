import React, { useState } from 'react';
import { OptimizationResult, ResumeData } from '../types';
import { Download, RefreshCw, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { regenerateSection } from '../services/geminiService';

interface ResultsViewProps {
  result: OptimizationResult;
  onReset: () => void;
}

type Tab = 'RESUME' | 'COVER_LETTER' | 'REPORT' | 'LINKEDIN';

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<Tab>('RESUME');
  const [resumeData, setResumeData] = useState<ResumeData>(result.optimizedResume);
  const [coverLetter, setCoverLetter] = useState(result.coverLetter);
  const [linkedin, setLinkedin] = useState(result.linkedinSummary);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  // Helper for downloading text as file
  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateResumeMarkdown = () => {
      let md = `# ${resumeData.contact.fullName}\n`;
      md += `${resumeData.contact.email} | ${resumeData.contact.phone} | ${resumeData.contact.location}\n\n`;
      md += `## Professional Summary\n${resumeData.summary}\n\n`;
      md += `## Experience\n`;
      resumeData.experience.forEach(exp => {
          md += `### ${exp.role} | ${exp.company}\n${exp.dates}\n`;
          exp.bullets.forEach(b => md += `- ${b}\n`);
          md += '\n';
      });
      md += `## Education\n`;
      resumeData.education.forEach(edu => {
          md += `### ${edu.degree}\n${edu.school}, ${edu.year}\n\n`;
      });
      md += `## Skills\n${resumeData.skills.join(', ')}`;
      return md;
  };

  const handleRegenerateBullet = async (expIndex: number, bulletIndex: number) => {
      const currentBullet = resumeData.experience[expIndex].bullets[bulletIndex];
      const id = `bullet-${expIndex}-${bulletIndex}`;
      setRegenerating(id);
      try {
          const newText = await regenerateSection(currentBullet, "Make it more results-oriented with a placeholder for metrics.", "bullet");
          const newExp = [...resumeData.experience];
          newExp[expIndex].bullets[bulletIndex] = newText.trim();
          setResumeData({...resumeData, experience: newExp});
      } finally {
          setRegenerating(null);
      }
  };

  const scoreData = [
    {
      name: 'Match Score',
      uv: result.analysis.matchScore,
      fill: result.analysis.matchScore > 80 ? '#16a34a' : result.analysis.matchScore > 60 ? '#ca8a04' : '#dc2626',
    },
    {
      name: 'Target',
      uv: 100,
      fill: '#f1f5f9',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center bg-slate-50 rounded-t-xl">
        <div>
            <h2 className="text-xl font-bold text-slate-900">Optimization Results</h2>
            <p className="text-sm text-slate-500">Target Role: {result.targetRole}</p>
        </div>
        <div className="flex space-x-2">
             <button onClick={() => downloadFile('resume.txt', generateResumeMarkdown())} className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                <Download className="w-4 h-4 mr-2" /> Resume (TXT)
             </button>
             <button onClick={() => downloadFile('cover-letter.txt', coverLetter)} className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                <Download className="w-4 h-4 mr-2" /> Cover Letter (TXT)
             </button>
             <button onClick={onReset} className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                New Fix
             </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 px-6">
          <div className="flex space-x-8">
              {(['RESUME', 'COVER_LETTER', 'LINKEDIN', 'REPORT'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                      {tab.replace('_', ' ')}
                  </button>
              ))}
          </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'RESUME' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                  {/* Header */}
                  <div className="text-center space-y-2 border-b border-slate-100 pb-6">
                      <input 
                        value={resumeData.contact.fullName}
                        onChange={(e) => setResumeData({...resumeData, contact: {...resumeData.contact, fullName: e.target.value}})}
                        className="text-3xl font-bold text-center w-full border-none focus:ring-0 text-slate-900" 
                      />
                      <div className="flex justify-center flex-wrap gap-4 text-slate-600 text-sm">
                          <input value={resumeData.contact.email} onChange={(e) => setResumeData({...resumeData, contact: {...resumeData.contact, email: e.target.value}})} className="text-center bg-transparent w-auto" />
                          <span>|</span>
                          <input value={resumeData.contact.phone} onChange={(e) => setResumeData({...resumeData, contact: {...resumeData.contact, phone: e.target.value}})} className="text-center bg-transparent w-auto" />
                          <span>|</span>
                          <input value={resumeData.contact.location || ''} onChange={(e) => setResumeData({...resumeData, contact: {...resumeData.contact, location: e.target.value}})} className="text-center bg-transparent w-auto" placeholder="City, Country" />
                      </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2 group relative">
                      <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">Professional Summary</h3>
                      <textarea 
                        value={resumeData.summary}
                        onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
                        className="w-full h-24 p-2 text-slate-700 text-sm leading-relaxed border-transparent hover:border-slate-200 focus:border-blue-300 rounded-md transition-colors resize-none"
                      />
                  </div>

                  {/* Experience */}
                  <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">Experience</h3>
                      {resumeData.experience.map((exp, idx) => (
                          <div key={exp.id || idx} className="space-y-2">
                              <div className="flex justify-between items-baseline">
                                  <div className="flex-1">
                                      <input 
                                        value={exp.role} 
                                        onChange={(e) => {
                                            const newExp = [...resumeData.experience];
                                            newExp[idx].role = e.target.value;
                                            setResumeData({...resumeData, experience: newExp});
                                        }}
                                        className="font-bold text-slate-900 w-full" 
                                      />
                                      <input 
                                        value={exp.company} 
                                        onChange={(e) => {
                                            const newExp = [...resumeData.experience];
                                            newExp[idx].company = e.target.value;
                                            setResumeData({...resumeData, experience: newExp});
                                        }}
                                        className="text-slate-700 italic w-full" 
                                      />
                                  </div>
                                  <input 
                                        value={exp.dates} 
                                        onChange={(e) => {
                                            const newExp = [...resumeData.experience];
                                            newExp[idx].dates = e.target.value;
                                            setResumeData({...resumeData, experience: newExp});
                                        }}
                                        className="text-right text-slate-500 text-sm" 
                                      />
                              </div>
                              <ul className="list-disc pl-5 space-y-2">
                                  {exp.bullets.map((bullet, bIdx) => (
                                      <li key={bIdx} className="text-sm text-slate-700 relative group pl-2">
                                          <div className="flex items-start">
                                              <textarea 
                                                value={bullet}
                                                onChange={(e) => {
                                                    const newExp = [...resumeData.experience];
                                                    newExp[idx].bullets[bIdx] = e.target.value;
                                                    setResumeData({...resumeData, experience: newExp});
                                                }}
                                                rows={2}
                                                className="flex-1 min-w-0 bg-transparent border-none p-0 focus:ring-0 resize-none overflow-hidden"
                                                style={{ height: 'auto', minHeight: '1.5em' }}
                                              />
                                              <button 
                                                onClick={() => handleRegenerateBullet(idx, bIdx)}
                                                disabled={!!regenerating}
                                                className={`ml-2 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity ${regenerating === `bullet-${idx}-${bIdx}` ? 'animate-spin text-blue-600 opacity-100' : ''}`}
                                                title="Regenerate this bullet"
                                              >
                                                  <RefreshCw className="w-4 h-4" />
                                              </button>
                                          </div>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      ))}
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                       <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">Skills</h3>
                       <textarea 
                            value={resumeData.skills.join(', ')}
                            onChange={(e) => setResumeData({...resumeData, skills: e.target.value.split(', ')})}
                            className="w-full p-2 text-slate-700 text-sm border-transparent hover:border-slate-200 focus:border-blue-300 rounded-md"
                        />
                  </div>
              </div>
          )}

          {activeTab === 'COVER_LETTER' && (
              <div className="max-w-3xl mx-auto">
                  <div className="bg-slate-50 p-6 rounded-lg mb-4 text-sm text-slate-600">
                      Tip: Review the brackets [ ] to ensure all placeholders are filled with real information before sending.
                  </div>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full h-[600px] p-8 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 font-serif text-slate-800 leading-relaxed resize-none bg-white"
                  />
              </div>
          )}

          {activeTab === 'LINKEDIN' && (
               <div className="max-w-3xl mx-auto">
                   <h3 className="text-lg font-semibold mb-4">LinkedIn 'About' Section</h3>
                   <textarea
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full h-[300px] p-6 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed resize-none bg-white"
                  />
                  <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => navigator.clipboard.writeText(linkedin)}
                        className="flex items-center text-blue-600 font-medium text-sm hover:underline"
                    >
                          <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
                      </button>
                  </div>
               </div>
          )}

          {activeTab === 'REPORT' && (
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">ATS Match Score</h3>
                      <div className="h-64 w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart innerRadius="70%" outerRadius="100%" data={scoreData} startAngle={90} endAngle={-270}>
                                <RadialBar background dataKey="uv" cornerRadius={30} />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
                                <Tooltip />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-4xl font-bold text-slate-900">{result.analysis.matchScore}</span>
                            <span className="text-xs text-slate-500">out of 100</span>
                        </div>
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Keyword Analysis</h3>
                      <div className="space-y-4">
                          <div>
                              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Found Keywords</p>
                              <div className="flex flex-wrap gap-2">
                                  {result.analysis.foundKeywords.map(k => (
                                      <span key={k} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-100">
                                          {k}
                                      </span>
                                  ))}
                              </div>
                          </div>
                          <div>
                              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Missing Keywords (Add these!)</p>
                              <div className="flex flex-wrap gap-2">
                                  {result.analysis.missingKeywords.map(k => (
                                      <span key={k} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-100">
                                          {k}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="md:col-span-2 bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">Recommendations</h3>
                      <ul className="space-y-3">
                          {result.analysis.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start text-blue-800 text-sm">
                                  <Check className="w-5 h-5 mr-3 flex-shrink-0 text-blue-600" />
                                  {rec}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};