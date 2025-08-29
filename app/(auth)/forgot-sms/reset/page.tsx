// reset/page.tsx
"use client";
import SmsResetFormContent from "./components/SmsResetFormContent";
import { useRouter } from "next/navigation";
import { usePasswordRecoveryRedux } from "@/hooks/usePasswordRecoveryRedux";
import { useEffect } from "react";
import FormSkeleton from "./components/FormSkeleton";
import PasswordRecoveryLoading from "@/components/PasswordRecoveryLoading";

export default function SmsResetForm() {
  const { state } = usePasswordRecoveryRedux();

  return (
    <PasswordRecoveryLoading fallback={<FormSkeleton />}>
      {state.phone && state.code && state.isVerified ? (
        <SmsResetFormContent phone={state.phone} code={state.code} />
      ) : (
        <FormSkeleton />
      )}
    </PasswordRecoveryLoading>
  );
}