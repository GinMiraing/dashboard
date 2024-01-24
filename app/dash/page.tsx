import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export default function Page() {
  const SessionData = cookies().get("SESSION");

  console.log(SessionData);

  if (!SessionData) {
    return redirect("/login", RedirectType.replace);
  }

  return <div>Dash Page</div>;
}
