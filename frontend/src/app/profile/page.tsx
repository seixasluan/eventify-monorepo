// components
import { AuthLayout, Input, Button, PasswordInput } from "@/components";

//api
import { getCurrentUser } from "@/lib/api";

export default async function Profile() {
  const user = await getCurrentUser();

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Profile</h1>
      <form className="space-y-4">
        <Input
          label="Name"
          type="text"
          value={user?.name}
          //onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
        />
        <Input
          label="Email"
          type="email"
          value={user?.email}
          // onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
        <PasswordInput
          label="Password"
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <Button type="submit">Edit Profile</Button>
      </form>
    </AuthLayout>
  );
}
