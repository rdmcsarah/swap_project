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
            تم معالجة طلبك بنجاح
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            تم استلام طلب التبديل الخاص بك وهو قيد المعالجة الآن.
          </p>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <dl className="space-y-4">
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الطلب
              </dt>
              <dd className="mt-1 text-sm font-mono text-gray-900 break-all">
                {id}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6">
          <p className="text-xs text-gray-500 text-center">
            يرجى حفظ رقم المرجع هذا للاستفسارات المستقبلية. ستصلك رسالة تأكيد بالبريد الإلكتروني قريباً.
          </p>
          
        </div>
      </div>
    </div>
  );
}