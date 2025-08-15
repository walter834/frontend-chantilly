"use client"
import React from "react";
import ProfileUpdateForm from "../components/ProfileUpdateForm";
import { useAuth } from "@/hooks/useAuth";
import { useParams,useRouter } from "next/navigation";


export default function Profile() {

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  return (
    <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="text-center ">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          TUS DATOS
        </h1>
        <ProfileUpdateForm id={id}/>
      </div>
    </div>
  );
}
