const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const overviewSectionEndIndex = content.indexOf('{/* Documents */}');

if (overviewSectionEndIndex !== -1) {
  const profileSection = `
              {/* Academic & Profile Details */}
              {(student.profile?.underGrad?.length > 0 || student.profile?.testScores?.length > 0 || student.profile?.workExperience?.length > 0) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <Briefcase className="text-blue-600" size={18} /> Academic & Profile Details
                  </h3>
                  
                  <div className="space-y-6">
                    {student.profile?.underGrad?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Undergraduate</h4>
                        <div className="space-y-3">
                          {student.profile.underGrad.map((ug: any, i: number) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <p className="text-sm font-bold text-gray-900">{ug.degreeName}</p>
                              <p className="text-xs text-gray-600 mt-1">{ug.uniName}</p>
                              {ug.cgpa && <p className="text-xs text-gray-500 mt-1 font-medium">CGPA: {ug.cgpa} / {ug.outOf || "10"}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {student.profile?.testScores?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Test Scores</h4>
                        <div className="flex flex-wrap gap-2">
                          {student.profile.testScores.map((score: any, i: number) => (
                            <div key={i} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-semibold">
                              <span>{score.testType}:</span>
                              <span>{score.score}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {student.profile?.workExperience?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Work Experience</h4>
                        <div className="space-y-3">
                          {student.profile.workExperience.map((work: any, i: number) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <p className="text-sm font-bold text-gray-900">{work.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{work.companyName}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              `;
              
  const before = content.substring(0, overviewSectionEndIndex);
  const after = content.substring(overviewSectionEndIndex);
  
  fs.writeFileSync(file, before + profileSection + after);
  console.log("Added Academic Profile section!");
} else {
  console.log("Could not find overview section end.");
}
