"use client";

import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function SwapPage() {
  const { id } = useParams();

  return (
<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
  <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6">
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
      </div>
      <h2 className="mt-3 text-xl font-semibold text-gray-900">
        تم الإجراء بنجاح
      </h2>
    
    </div>

    <div className="mt-6 border-t border-gray-200 pt-6">
      <dl className="space-y-4">
        <div className="bg-gray-50 px-4 py-3 rounded-lg">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            رقم المرجع
          </dt>
          <dd className="mt-1 text-sm font-mono text-gray-900 break-all">
            {id}
          </dd>
        </div>
      </dl>
    </div>

    <div className="mt-6">
      <p className="text-xs text-gray-500 text-center">
        يرجى الاحتفاظ برقم المرجع للمتابعة أو الاستفسارات المستقبلية. سيتم إرسال رسالة تأكيد إلى بريدك الإلكتروني قريباً.
      </p>
    </div>
  </div>
</div>

  );
}