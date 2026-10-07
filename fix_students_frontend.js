const fs = require('fs');
const file = 'frontend/app/partnership/students/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the imports to include Search and Chevron icons
content = content.replace(
  'import { UserCheck, UserPlus, X, Check, AlertCircle, Eye } from "lucide-react";',
  'import { UserCheck, UserPlus, X, Check, AlertCircle, Eye, Search as SearchIcon, ChevronLeft, ChevronRight, Filter } from "lucide-react";'
);

// We will overwrite the component implementation to add search/pagination states and UI.
// So let's extract everything from `export default function Students() {` and replace it.

const newComponentCode = `export default function Students() {
  const [students, setStudents] = useState<StudentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [consultants, setConsultants] = useState<ConsultantOption[]>([]);
  const [selectedLead, setSelectedLead] = useState<StudentLead | null>(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  
  // Search and Pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [consultantFilter, setConsultantFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });

  const user = getUser();
  const isEduMitraOrAdmin = user?.role === "admin" || user?.partnerProfile?.partnerType === "edu_mitra";

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20"
      });
      
      if (searchQuery) queryParams.append("search", searchQuery);
      if (statusFilter) queryParams.append("status", statusFilter);
      if (consultantFilter) queryParams.append("consultantId", consultantFilter);

      const res = await axios.get<{ success: boolean; leads: StudentLead[]; pagination?: any; message?: string }>(
        \`\${BACKEND_URL}/api/partnership/student-leads?\${queryParams.toString()}\`,
        { headers: { Authorization: \`Bearer \${getToken()}\` } }
      );
      
      if (res.data.success) {
        setStudents(res.data.leads || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      } else {
        setError(res.data.message || "Failed to load leads");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || "Error fetching students");
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, currentPage, searchQuery, statusFilter, consultantFilter]);

  const fetchConsultants = useCallback(() => {
    if (!isEduMitraOrAdmin) return;
    axios
      .get<{ consultants: ConsultantOption[] }>(
        \`\${BACKEND_URL}/api/partnership/consultants\`,
        { headers: { Authorization: \`Bearer \${getToken()}\` } }
      )
      .then((res) => setConsultants(res.data.consultants || []))
      .catch(() => {});
  }, [BACKEND_URL, isEduMitraOrAdmin]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  
  useEffect(() => {
    fetchConsultants();
  }, [fetchConsultants]);

  // Handle Search Submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(searchInput);
  };

  const openAssignModal = (lead: StudentLead) => {
    setSelectedLead(lead);
    setSelectedConsultantId(lead.assignedConsultantId?._id || "");
    setAssignmentNotes(lead.assignmentNotes || "");
    setAssignError(null);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      setIsAssigning(true);
      setAssignError(null);

      const payload = {
        consultantId: selectedConsultantId || null,
        notes: assignmentNotes,
      };

      await axios.put(
        \`\${BACKEND_URL}/api/partnership-leads/\${selectedLead.studentLeadId}/assign-consultant\`,
        payload,
        { headers: { Authorization: \`Bearer \${getToken()}\` } }
      );

      await fetchStudents();
      setSelectedLead(null);
    } catch (err: any) {
      setAssignError(err.response?.data?.error || "Failed to assign consultant.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <PartnerGuard>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
            <p className="text-sm text-gray-500 mt-1">
              View all students on the platform and assign them to your counseling staff.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 w-full max-w-lg relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, phone, college or Lead ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </form>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="REGISTERED">Registered</option>
                <option value="ATTENDED">Attended</option>
                <option value="INTERESTED">Interested</option>
                <option value="CONTACT_PENDING">Contact Pending</option>
                <option value="NO_SHOW">No Show</option>
                <option value="NOT_INTERESTED">Not Interested</option>
              </select>
            </div>
            
            {isEduMitraOrAdmin && (
              <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
                <UserCheck size={16} className="text-gray-500" />
                <select
                  value={consultantFilter}
                  onChange={(e) => { setConsultantFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer max-w-[150px] truncate"
                >
                  <option value="">All Consultants</option>
                  <option value="unassigned">Unassigned</option>
                  {consultants.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden border">
          <div className="overflow-x-auto relative min-h-[300px]">
            {loading && (
              <div className="absolute inset-0 z-20 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
                <div className="px-4 py-2 bg-white shadow-lg rounded-full text-sm font-semibold text-blue-600 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading directory...
                </div>
              </div>
            )}
            
            {!loading && students.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-gray-200 m-8 rounded-xl">
                <h3 className="text-gray-900 font-bold text-lg">No students found.</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                {(searchQuery || statusFilter || consultantFilter) && (
                  <button 
                    onClick={() => { setSearchInput(""); setSearchQuery(""); setStatusFilter(""); setConsultantFilter(""); setCurrentPage(1); }}
                    className="mt-4 text-blue-600 text-sm font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <table className="min-w-[1200px] divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Lead ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Course / Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Preferred Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Assigned Consultant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Attribution Date
                    </th>
                    <th className="sticky right-0 bg-gray-50 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)] z-10">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50/70">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {s.studentLeadId}
                      </td>
                      <td className="px-6 py-4">{s.fullName}</td>
                      <td className="px-6 py-4 text-gray-600">{s.email || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {s.collegeId?.name || s.collegeName || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{s.mobile}</td>
                      <td className="px-6 py-4">
                        {s.preferredProgram || s.course || "-"}
                        {s.graduationYear ? \` (\${s.graduationYear})\` : ""}
                      </td>
                      <td className="px-6 py-4">{s.preferredCountry || "-"}</td>
                      <td className="px-6 py-4">
                        {s.assignedConsultantId ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <UserCheck size={12} />
                              {s.assignedConsultantId.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {s.leadStatus || "REGISTERED"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {s.attributionStartDate
                          ? new Date(s.attributionStartDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="sticky right-0 bg-white/95 backdrop-blur-sm px-6 py-4 text-right space-x-3 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.03)] z-10">
                        {isEduMitraOrAdmin && (
                          <button
                            onClick={() => openAssignModal(s)}
                            className="font-semibold text-xs text-blue-700 hover:text-blue-900 hover:underline mr-3"
                          >
                            {s.assignedConsultantId ? "Reassign" : "Assign"}
                          </button>
                        )}
                        <Link
                          href={\`/partnership/students/\${encodeURIComponent(
                            s.studentLeadId
                          )}\`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                          <Eye size={14} />
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {!loading && students.length > 0 && pagination.totalPages > 1 && (
            <div className="border-t px-6 py-4 flex items-center justify-between bg-gray-50/50">
              <span className="text-sm text-gray-600">
                Showing <span className="font-bold">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="font-bold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-bold">{pagination.total}</span> students
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={pagination.page <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded bg-white border shadow-sm disabled:opacity-50 hover:bg-gray-50 flex items-center text-sm font-medium"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button 
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  className="px-3 py-1.5 rounded bg-white border shadow-sm disabled:opacity-50 hover:bg-gray-50 flex items-center text-sm font-medium"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Assign Consultant */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Assign Counselor to Student
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Lead: {selectedLead.fullName} ({selectedLead.studentLeadId})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              {assignError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{assignError}</span>
                </div>
              )}

              <form onSubmit={handleSaveAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Active Consultant
                  </label>
                  <select
                    value={selectedConsultantId}
                    onChange={(e) => setSelectedConsultantId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="">-- Unassigned (No Consultant) --</option>
                    {consultants.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.role}) - {c.email}
                      </option>
                    ))}
                  </select>
                  {consultants.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      No active consultants found. Please add consultants in the{" "}
                      <Link
                        href="/partnership/consultants"
                        className="underline font-bold"
                      >
                        Consultants section
                      </Link>
                      .
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Assignment Instructions / Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Interested in UK Masters in CS. Initial counseling call pending."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isAssigning}
                    type="submit"
                    className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                  >
                    {isAssigning ? "Saving..." : "Confirm Assignment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PartnerGuard>
  );
}`;

content = content.substring(0, content.indexOf('export default function Students() {')) + newComponentCode;

fs.writeFileSync(file, content);
console.log('Updated students directory UI');
