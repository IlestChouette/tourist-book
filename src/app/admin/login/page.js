import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
