import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/SignupForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign up · Dealer Report" };

export default function SignupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading">Create your account</CardTitle>
        <CardDescription>
          Set up a distributor account to start onboarding dealers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
