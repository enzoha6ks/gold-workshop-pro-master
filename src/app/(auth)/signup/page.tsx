'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Workshop created! Please login.");
      router.push("/login");
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Workshop</CardTitle>
          <p className="text-sm text-slate-500">Start managing your gold professionaly</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Workshop Name</label>
              <Input name="workshopName" placeholder="e.g. Al-Baraka Gold" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Email</label>
              <Input name="email" type="email" placeholder="admin@workshop.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input name="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
              {loading ? "Creating..." : "Register Workshop"}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Already have a workshop? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}