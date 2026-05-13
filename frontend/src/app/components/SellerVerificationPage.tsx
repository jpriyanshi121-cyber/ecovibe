import React from "react";
import { useState } from "react";
import { Upload, CheckCircle2, AlertCircle, Shield, Building2, Leaf, CreditCard, FileText, User } from "lucide-react";
import { toast } from "sonner";

type VerificationStep = "personal" | "business" | "documents" | "banking" | "sustainability" | "review";

export function SellerVerificationPage() {
  const [currentStep, setCurrentStep] = useState<VerificationStep>("personal");
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Business Information
    businessType: "individual",
    businessName: "",
    businessRegistration: "",
    taxId: "",
    
    // Documents
    idDocument: null as File | null,
    addressProof: null as File | null,
    businessLicense: null as File | null,
    
    // Banking
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    
    // Sustainability
    sustainabilityCertifications: [] as string[],
    recyclingPractices: "",
    sustainabilityStatement: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string}>({});

  const steps: {id: VerificationStep; title: string; icon: any}[] = [
    { id: "personal", title: "Personal Info", icon: User },
    { id: "business", title: "Business Details", icon: Building2 },
    { id: "documents", title: "Documents", icon: FileText },
    { id: "banking", title: "Banking Info", icon: CreditCard },
    { id: "sustainability", title: "Sustainability", icon: Leaf },
    { id: "review", title: "Review", icon: Shield },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleFileUpload = (field: string, file: File | null) => {
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      setUploadedFiles(prev => ({ ...prev, [field]: file.name }));
      toast.success("File uploaded successfully");
    }
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    toast.success("Verification submitted successfully!", {
      description: "We'll review your application and get back to you within 2-3 business days.",
      duration: 5000,
    });
  };

  const toggleCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      sustainabilityCertifications: prev.sustainabilityCertifications.includes(cert)
        ? prev.sustainabilityCertifications.filter(c => c !== cert)
        : [...prev.sustainabilityCertifications, cert]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-3">Become a Verified Seller</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our community of verified sellers and start listing your sustainable products. Complete the verification process to build trust with buyers.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-gradient-to-br from-emerald-400 to-teal-600"
                          : isCurrent
                          ? "bg-gradient-to-br from-emerald-400 to-teal-600 ring-4 ring-emerald-100"
                          : "bg-gray-200"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className={`w-6 h-6 ${isCurrent ? "text-white" : "text-gray-400"}`} />
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center hidden sm:block ${isCurrent ? "text-emerald-600" : "text-gray-500"}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                        isCompleted ? "bg-gradient-to-r from-emerald-400 to-teal-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          {/* Personal Information */}
          {currentStep === "personal" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-600 text-sm">Please provide your personal details for verification purposes.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="123 Main St"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="San Francisco"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="CA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="94102"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Business Information */}
          {currentStep === "business" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-2">Business Details</h2>
                <p className="text-gray-600 text-sm">Tell us about your business or selling activities.</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-3">Business Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["individual", "small-business", "registered-company"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData(prev => ({ ...prev, businessType: type }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.businessType === type
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="text-sm capitalize">{type.replace("-", " ")}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Business Name {formData.businessType !== "individual" && "*"}
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="EcoGoods Inc."
                    disabled={formData.businessType === "individual"}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Business Registration Number {formData.businessType === "registered-company" && "*"}
                  </label>
                  <input
                    type="text"
                    value={formData.businessRegistration}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessRegistration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="12345678"
                    disabled={formData.businessType === "individual"}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Tax ID / EIN (Optional)</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="XX-XXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {currentStep === "documents" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-2">Verification Documents</h2>
                <p className="text-gray-600 text-sm">Upload required documents for identity verification.</p>
              </div>
              
              <div className="space-y-4">
                {/* ID Document */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700">Government-issued ID *</label>
                    {uploadedFiles.idDocument && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Driver's license, passport, or national ID</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload("idDocument", e.target.files?.[0] || null)}
                    className="hidden"
                    id="idDocument"
                  />
                  <label
                    htmlFor="idDocument"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">{uploadedFiles.idDocument || "Choose File"}</span>
                  </label>
                </div>

                {/* Address Proof */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700">Proof of Address *</label>
                    {uploadedFiles.addressProof && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Utility bill, bank statement, or lease agreement (dated within last 3 months)</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload("addressProof", e.target.files?.[0] || null)}
                    className="hidden"
                    id="addressProof"
                  />
                  <label
                    htmlFor="addressProof"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">{uploadedFiles.addressProof || "Choose File"}</span>
                  </label>
                </div>

                {/* Business License (conditional) */}
                {formData.businessType !== "individual" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-700">Business License {formData.businessType === "registered-company" && "*"}</label>
                      {uploadedFiles.businessLicense && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Uploaded
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Business registration certificate or license</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("businessLicense", e.target.files?.[0] || null)}
                      className="hidden"
                      id="businessLicense"
                    />
                    <label
                      htmlFor="businessLicense"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">{uploadedFiles.businessLicense || "Choose File"}</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-1">All documents must be:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Clear and readable</li>
                    <li>In color (not black and white)</li>
                    <li>Valid and not expired</li>
                    <li>Show your full name and address</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Banking Information */}
          {currentStep === "banking" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-2">Banking Information</h2>
                <p className="text-gray-600 text-sm">Add your bank account details to receive payments from sales.</p>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-6">
                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-900">
                  <p>Your banking information is encrypted and secure. We never store your full account details on our servers.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Account Holder Name *</label>
                  <input
                    type="text"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Bank Name *</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="Chase Bank"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Account Number *</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="••••••••1234"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Routing Number *</label>
                  <input
                    type="text"
                    value={formData.routingNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="123456789"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sustainability */}
          {currentStep === "sustainability" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-2">Sustainability Commitment</h2>
                <p className="text-gray-600 text-sm">Share your sustainability practices and certifications.</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-3">Sustainability Certifications (Optional)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "B Corp Certified",
                    "Fair Trade Certified",
                    "Cradle to Cradle",
                    "Energy Star",
                    "LEED Certified",
                    "Zero Waste Certified",
                    "Carbon Neutral",
                    "Organic Certified"
                  ].map((cert) => (
                    <button
                      key={cert}
                      onClick={() => toggleCertification(cert)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.sustainabilityCertifications.includes(cert)
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          formData.sustainabilityCertifications.includes(cert)
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300"
                        }`}>
                          {formData.sustainabilityCertifications.includes(cert) && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="text-sm">{cert}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">Recycling Practices *</label>
                <textarea
                  value={formData.recyclingPractices}
                  onChange={(e) => setFormData(prev => ({ ...prev, recyclingPractices: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  placeholder="Describe your recycling and waste management practices..."
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">Sustainability Statement *</label>
                <textarea
                  value={formData.sustainabilityStatement}
                  onChange={(e) => setFormData(prev => ({ ...prev, sustainabilityStatement: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  placeholder="Share your commitment to sustainability and the circular economy..."
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                <Leaf className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <p>Your sustainability practices will be displayed on your seller profile to help buyers make informed decisions.</p>
                </div>
              </div>
            </div>
          )}

          {/* Review */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-2">Review Your Information</h2>
                <p className="text-gray-600 text-sm">Please review all information before submitting your verification request.</p>
              </div>
              
              <div className="space-y-6">
                {/* Personal Info Summary */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-gray-900">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="text-gray-900">{formData.fullName || "—"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="text-gray-900">{formData.email || "—"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="text-gray-900">{formData.phone || "—"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="text-gray-900">{formData.city && formData.state ? `${formData.city}, ${formData.state}` : "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Business Info Summary */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-gray-900">Business Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Business Type:</span>
                      <p className="text-gray-900 capitalize">{formData.businessType.replace("-", " ")}</p>
                    </div>
                    {formData.businessName && (
                      <div>
                        <span className="text-gray-500">Business Name:</span>
                        <p className="text-gray-900">{formData.businessName}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents Summary */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-gray-900">Documents</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Government ID:</span>
                      <span className={uploadedFiles.idDocument ? "text-emerald-600" : "text-gray-400"}>
                        {uploadedFiles.idDocument || "Not uploaded"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Proof of Address:</span>
                      <span className={uploadedFiles.addressProof ? "text-emerald-600" : "text-gray-400"}>
                        {uploadedFiles.addressProof || "Not uploaded"}
                      </span>
                    </div>
                    {formData.businessType !== "individual" && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Business License:</span>
                        <span className={uploadedFiles.businessLicense ? "text-emerald-600" : "text-gray-400"}>
                          {uploadedFiles.businessLicense || "Not uploaded"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sustainability Summary */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-gray-900">Sustainability</h3>
                  </div>
                  <div className="text-sm space-y-3">
                    {formData.sustainabilityCertifications.length > 0 && (
                      <div>
                        <span className="text-gray-500 block mb-2">Certifications:</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.sustainabilityCertifications.map(cert => (
                            <span key={cert} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.sustainabilityStatement && (
                      <div>
                        <span className="text-gray-500 block mb-1">Statement:</span>
                        <p className="text-gray-900 text-xs">{formData.sustainabilityStatement}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <p className="mb-1">By submitting this verification request, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>ReCircle's Seller Terms & Conditions</li>
                    <li>Our Code of Conduct and sustainability guidelines</li>
                    <li>Allow ReCircle to verify the information provided</li>
                    <li>Maintain accurate product listings and honest descriptions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          {currentStep === "review" ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              Submit for Verification
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
