import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Link } from "@/components/ui/Link";

export function LoginForm() {
  return (
    <form className="flex flex-col space-y-4">
      <div className="mb-4 flex flex-col items-center justify-center space-y-1 text-center">
        <h2 className="text-lg font-bold">Login</h2>
        <p className="text-sm font-medium text-foreground/60">
          Welcome back! Please login to continue
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <Button type="submit" className="mt-2">
        Login
      </Button>

      <div className="mt-2 flex justify-center">
        <Link className="w-fit" size="sm" href="/auth/register">
          Create new account
        </Link>
      </div>
    </form>
  );
}
