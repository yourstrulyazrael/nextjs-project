import { redirect } from "next/navigation";

// The user's dashboard lives on the account page.
export default function DashboardPage() {
  redirect("/account");
}
