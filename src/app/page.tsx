"use client"
import { SetStateAction, useState, useEffect } from "react";
import { ReceiptEuro, User, ChevronDown, LogIn, IdCard, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [employeeCode, setEmployeeCode] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCodeSaved, setIsCodeSaved] = useState(false);
  const router = useRouter();

  // التحقق من وجود رمز الموظف محفوظ مسبقًا عند تحميل المكون
  useEffect(() => {
    const savedEmployeeId = localStorage.getItem("employeeId");
    if (savedEmployeeId) {
      setEmployeeCode(savedEmployeeId);
      setIsCodeSaved(true);
    }
  }, []);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // حفظ رمز الموظف في localStorage
    localStorage.setItem("employeeId", employeeCode);
    setIsCodeSaved(true);
    console.log("تم حفظ رمز الموظف في localStorage:", employeeCode);
        window.location.href = "/";

  };

  // const handleOptionSelect = (option: SetStateAction<string>) => {
  //   setSelectedOption(option);
  //   setIsDropdownOpen(false);
  //   // هنا يمكنك التوجيه إلى الصفحة المناسبة بناءً على الاختيار
  //   console.log("الخيار المحدد:", option);
  // };

  const clearEmployeeCode = () => {
    localStorage.removeItem("employeeId");
    setEmployeeCode("");
    setIsCodeSaved(false);
    window.location.href = "/";

  };

  // const options = [
  //   { id: "swap", label: "طلب تبديل", icon: <ReceiptEuro size={18} /> },
  //   { id: "evaluation", label: "تقييم متدرب", icon: <User size={18} /> },
  //   { id: "shadowing", label: "مرافقة سائق", icon: <User size={18} /> },
  // ];

  return (
 <div
  className="relative min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center p-6"
>
  {/* Background Image + Dark Overlay */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: "url('/assets/METRO.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
    }}
  >
    <div className="absolute inset-0 bg-black opacity-60" />
  </div>

  {/* Foreground Content */}
  <div className="relative z-10 w-full max-w-md backdrop-blur-md rounded-2xl shadow-xl border border-gray-300 p-10 opacity-95">
    {isCodeSaved ? (
      <div className="text-center">
        <div className="p-6 rounded-lg mb-8 shadow-md border border-green-600">
          <h1 className="text-white text-xl font-semibold">
            تطبيق لتبديل السائقين بين المركبات بسهولة وكفاءة
          </h1>
          {/* Additional success messages can go here */}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/data_")}
            className="flex-1 flex items-center justify-center p-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-shadow shadow-md focus:outline-none focus:ring-4 focus:ring-green-400"
            aria-label="طلب تبديل السائقين"
          >
            طلب تبديل
          </button>
          {/* Uncomment and style additional buttons as needed */}
        </div>

        <button
          onClick={clearEmployeeCode}
          className="mt-8 block text-sm text-gray-200 hover:text-gray-400 underline transition"
          aria-label="استخدام رمز موظف مختلف"
        >
          استخدام رمز موظف مختلف
        </button>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-7" noValidate>
        <div>
          <label
            htmlFor="employeeCode"
            className="block text-sm font-medium text-gray-700 mb-2 text-right"
          >
            رمز الموظف
          </label>
          <input
            id="employeeCode"
            type="text"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-green-400 focus:border-green-600 transition text-right bg-white placeholder-gray-400"
            placeholder="أدخل رمز الموظف"
            required
            aria-required="true"
            aria-describedby="employeeCodeHelp"
          />
        </div>

<button
  type="submit"
  disabled={!employeeCode.trim()}
  className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-green-700 hover:bg-green-800 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-shadow shadow-md focus:outline-none focus:ring-4 focus:ring-green-400"
  aria-label="حفظ ومتابعة"
  onClick={() => {
    window.location.href = "/"; // This causes a full page reload
  }}
>
  <LogIn size={18} />
  حفظ ومتابعة
</button>

      </form>
    )}
  </div>
</div>


  );
}