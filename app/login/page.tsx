import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser } from '../actions/login-user';

export default function LoginPage() { 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black px-4">
      <Card className="w-full max-w-md border border-black/10 bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-black">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-black/60">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <form action={loginUser}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black/80">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="bg-white border-black/10 text-black placeholder:text-black/30"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black/80">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="bg-white border-black/10 text-black placeholder:text-black/30"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90 mt-3"
            >
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
