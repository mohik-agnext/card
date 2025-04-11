import Link from "next/link";
// import Image from "next/image";

export default function CertificatesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-amber-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Employee Certificates Portal</h1>
          <Link href="/" className="bg-white text-amber-600 px-3 py-1 rounded hover:bg-gray-100">
            Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6 flex flex-col md:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Certificate Information</h2>
          
          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
            <div className="flex items-center gap-4">
              <input type="text" className="flex-1 border rounded p-2 text-sm" placeholder="Photo URL" />
              <button className="bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm">UPLOAD</button>
            </div>
          </div>
          
          {/* Employee Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
            <input type="text" className="w-full border rounded p-2" placeholder="Enter full name" />
          </div>
          
          {/* Designation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <input type="text" className="w-full border rounded p-2" placeholder="Enter designation" />
          </div>
          
          {/* Certificate Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Type</label>
            <select className="w-full border rounded p-2">
              <option value="">Select certificate type</option>
              <option value="achievement">Achievement</option>
              <option value="training">Training Completion</option>
              <option value="appreciation">Appreciation</option>
              <option value="excellence">Excellence</option>
            </select>
          </div>
          
          {/* Issue Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
            <input type="date" className="w-full border rounded p-2" />
          </div>
          
          {/* Certificate Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Description</label>
            <textarea className="w-full border rounded p-2 h-24" placeholder="Enter certificate details"></textarea>
          </div>
          
          <button className="bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 w-full">
            Generate Certificate
          </button>
        </div>
        
        {/* Preview Section */}
        <div className="w-full md:w-1/2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Live Preview</h2>
            
            <div className="border p-6 rounded-lg bg-gray-50">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-amber-600">CERTIFICATE</h3>
                <p className="text-sm text-gray-500">of Achievement</p>
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">Photo</div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold">Employee Name</h3>
                  <p className="text-gray-600">Designation</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-amber-50 rounded border border-amber-100">
                <p className="italic text-gray-700">Certificate description will appear here...</p>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500">Issue Date:</p>
                  <p className="font-medium">MM/DD/YYYY</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-10 border-b border-gray-400 mb-1"></div>
                  <p className="text-sm text-gray-500">Signature</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t text-center">
                <div className="flex justify-center mt-2 gap-3">
                  <span className="w-6 h-6 bg-gray-200 rounded-full"></span>
                  <span className="w-6 h-6 bg-gray-200 rounded-full"></span>
                  <span className="w-6 h-6 bg-gray-200 rounded-full"></span>
                  <span className="w-6 h-6 bg-gray-200 rounded-full"></span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                Copy
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 