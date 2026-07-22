import AdminShell from "../../dashboard/components/Action/AdminShell";
import AccountCreateForm from "../components/forms/AccountCreateForm";

export default function CreateAccountPage() {
  return (
    <AdminShell>
      <div className="space-y-5">
        <AccountCreateForm />
      </div>
    </AdminShell>
  );
}