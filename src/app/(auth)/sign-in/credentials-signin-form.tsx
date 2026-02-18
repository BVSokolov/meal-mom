"use client"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { signInWithCredentials } from "@/src/lib/actions/user.actions"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

const SignInFormField = ({
  name,
  label,
  placeholder,
}: {
  name: string
  label: string
  placeholder?: string
}) => (
  <div>
    <Label htmlFor={name} className="mb-1">
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      type={name}
      required
      autoComplete={name}
      placeholder={placeholder}
    />
  </div>
)

const SignInButton = () => {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} className="w-full" variant="default">
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  )
}

const CredentialsSignInForm = () => {
  const [data, actions] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  return (
    <form action={actions}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <SignInFormField
          name="email"
          label="Email"
          placeholder="email@example.com"
        />
        <SignInFormField name="password" label="Password" />
        <div>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" target="_self" className="link underline ">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  )
}

export default CredentialsSignInForm
