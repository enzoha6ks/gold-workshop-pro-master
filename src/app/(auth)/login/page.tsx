'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Login successful! Redirecting...");
      router.push("/dashboard"); // Or just "/" if your dashboard is at root
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || "Invalid credentials");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Workshop Login</CardTitle>
          <p className="text-sm text-slate-500">Welcome back to Gold Workshop Pro</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="email" type="email" placeholder="admin@workshop.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input name="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
            <p className="text-center text-sm text-slate-600">
               <Link href="/signup" className="text-blue-600 hover:underline"></Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}