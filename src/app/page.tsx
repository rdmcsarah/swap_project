"use client"
import { SetStateAction, useState, useEffect } from "react";
import { ReceiptEuro, User, ChevronDown, LogIn, IdCard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [employeeCode, setEmployeeCode] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCodeSaved, setIsCodeSaved] = useState(false);
  const router = useRouter();

  // Check if employee code is already saved on component mount
  useEffect(() => {
    const savedEmployeeId = localStorage.getItem("employeeId");
    if (savedEmployeeId) {
      setEmployeeCode(savedEmployeeId);
      setIsCodeSaved(true);
    }
  }, []);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Save employee code to localStorage
    localStorage.setItem("employeeId", employeeCode);
    setIsCodeSaved(true);
    console.log("Employee code saved to localStorage:", employeeCode);
  };

  const handleOptionSelect = (option: SetStateAction<string>) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    // Here you would navigate to the appropriate page based on selection
    console.log("Selected option:", option);
  };

  const clearEmployeeCode = () => {
    localStorage.removeItem("employeeId");
    setEmployeeCode("");
    setIsCodeSaved(false);
  };

  const options = [
    { id: "swap", label: "طلب تبديل", icon: <ReceiptEuro size={18} /> },
    { id: "evaluation", label: "تقييم متدرب", icon: <User size={18} /> },
    { id: "shadowing", label: "مرافقة سائق", icon: <User size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <IdCard className="text-green-600" size={40} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Employee Portal</h1>
          <p className="text-gray-600 mt-2">Please enter your employee code to continue</p>
        </div>

        {isCodeSaved ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
              <p className="font-medium">Employee code saved successfully!</p>
              <p className="text-sm mt-1">Your ID: {employeeCode}</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800">Select an option:</h2>
              
              <button 
                onClick={() => router.push("/data_")}
                className="w-full flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
              >
                <ReceiptEuro size={20} className="ml-2" />
                طلب تبديل
              </button>
              
              <button 
                onClick={() => handleOptionSelect("evaluation")}
                className="w-full flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
              >
                <User size={20} className="ml-2" />
                تقييم متدرب
              </button>
              
              {/* <button 
                onClick={() => handleOptionSelect("shadowing")}
                className="w-full flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
              >
                <User size={20} className="ml-2" />
                مرافقة سائق
              </button> */}
            </div>
            
            <button 
              onClick={clearEmployeeCode}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Use different employee code
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="employeeCode" className="block text-sm font-medium text-gray-700 mb-1">
                Employee Code
              </label>
              <div className="relative">
                <input
                  id="employeeCode"
                  type="text"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Enter your employee code"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This will be saved in localStorage</p>
            </div>

            <button
              type="submit"
              disabled={!employeeCode}
              className="w-full flex items-center justify-center py-3 px-4 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-2 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={18} className="ml-2" />
              Save and Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}