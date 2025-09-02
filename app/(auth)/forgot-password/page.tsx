import ForgotPasswordCard from "./components/ForgotPasswordCard";
import Header from "@/components/HeaderIndi/header";


export default function ForgotPassword() {
  return (
    <>
    <Header/>
    <div className="flex justify-center items-center py-10 min-h-screen">
      <ForgotPasswordCard/>
    </div>
    </>
  );
}
