import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Check, Upload, User, FileText } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { language } = useLanguage();
  const t = translations[language]?.careers || translations.en.careers;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "",
    current_company: "", current_ctc: ""
  });
  const [files, setFiles] = useState({ photo: null, resume: null, payslip: null });
  
  const photoRef = useRef(null);
  const resumeRef = useRef(null);
  const payslipRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/jobs/${jobId}`)
      .then(r => { setJob(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [jobId]);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.photo || !files.resume) {
      toast.error("Please upload photo and resume");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        job_id: jobId,
        photo_base64: await fileToBase64(files.photo),
        resume_base64: await fileToBase64(files.resume),
        payslip_base64: files.payslip ? await fileToBase64(files.payslip) : null
      };
      await axios.post(`${API}/jobs/apply`, payload);
      toast.success(t.success);
      setForm({ name: "", email: "", phone: "", address: "", current_company: "", current_ctc: "" });
      setFiles({ photo: null, resume: null, payslip: null });
    } catch {
      toast.error("Failed to submit application");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!job) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Job not found</p>
      <Button asChild variant="outline"><Link to="/careers"><ArrowLeft className="mr-2 h-4 w-4" /> {t.backToJobs}</Link></Button>
    </div>
  );

  return (
    <div data-testid="job-detail-page" className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="mb-6" data-testid="back-to-careers">
            <Link to="/careers"><ArrowLeft className="mr-2 h-4 w-4" /> {t.backToJobs}</Link>
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="job-title">{job.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            {job.department && <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-[#044736]" /> {job.department}</span>}
            {job.location && <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#044736]" /> {job.location}</span>}
            {job.type && <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#044736]" /> {job.type}</span>}
            {job.salary_range && <span className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-[#044736]" /> {job.salary_range}</span>}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {job.experience && <Badge className="bg-[#D9F99D] text-[#044736]">{job.experience}</Badge>}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-3 space-y-8">
            {job.description && (
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t.description}</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                </CardContent>
              </Card>
            )}

            {job.responsibilities?.length > 0 && (
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t.responsibilities}</h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-[#044736] mt-0.5 shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {job.requirements?.length > 0 && (
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t.requirements}</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm rounded-2xl sticky top-24">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t.applicationForm}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="job-application-form">
                  <div>
                    <Label>{t.fullName} *</Label>
                    <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="rounded-xl" data-testid="applicant-name" />
                  </div>
                  
                  <div>
                    <Label>{t.email} *</Label>
                    <Input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="rounded-xl" data-testid="applicant-email" />
                  </div>
                  
                  <div>
                    <Label>{t.phone} *</Label>
                    <Input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="rounded-xl" data-testid="applicant-phone" />
                  </div>
                  
                  <div>
                    <Label>{t.address}</Label>
                    <Textarea rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="rounded-xl" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>{t.currentCompany}</Label>
                      <Input value={form.current_company} onChange={e => setForm({...form, current_company: e.target.value})} className="rounded-xl" />
                    </div>
                    <div>
                      <Label>{t.currentCTC}</Label>
                      <Input value={form.current_ctc} onChange={e => setForm({...form, current_ctc: e.target.value})} className="rounded-xl" />
                    </div>
                  </div>
                  
                  {/* File Uploads */}
                  <div>
                    <Label>{t.photo} *</Label>
                    <input type="file" ref={photoRef} accept="image/*" className="hidden" onChange={e => setFiles({...files, photo: e.target.files[0]})} />
                    <Button type="button" variant="outline" className="w-full rounded-xl justify-start" onClick={() => photoRef.current.click()}>
                      <User className="h-4 w-4 mr-2" /> {files.photo ? files.photo.name : "Upload Photo"}
                    </Button>
                  </div>
                  
                  <div>
                    <Label>{t.resume} *</Label>
                    <input type="file" ref={resumeRef} accept=".pdf" className="hidden" onChange={e => setFiles({...files, resume: e.target.files[0]})} />
                    <Button type="button" variant="outline" className="w-full rounded-xl justify-start" onClick={() => resumeRef.current.click()}>
                      <FileText className="h-4 w-4 mr-2" /> {files.resume ? files.resume.name : "Upload Resume (PDF)"}
                    </Button>
                  </div>
                  
                  <div>
                    <Label>{t.payslip}</Label>
                    <input type="file" ref={payslipRef} accept=".pdf,image/*" className="hidden" onChange={e => setFiles({...files, payslip: e.target.files[0]})} />
                    <Button type="button" variant="outline" className="w-full rounded-xl justify-start" onClick={() => payslipRef.current.click()}>
                      <Upload className="h-4 w-4 mr-2" /> {files.payslip ? files.payslip.name : "Upload Payslip"}
                    </Button>
                  </div>
                  
                  <Button type="submit" disabled={submitting} className="w-full bg-[#044736] hover:bg-[#033326] text-white rounded-full py-6 text-base font-semibold" data-testid="submit-application">
                    {submitting ? "Submitting..." : t.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
