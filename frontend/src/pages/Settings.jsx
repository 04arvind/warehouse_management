import {
  User,
  Shield,
  Bell,
} from "lucide-react";

import {
  useAuth,
} from "../context";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-7">

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
          Configuration
        </p>

        <h1 className="mt-2 text-2xl font-semibold">
          Settings
        </h1>

        <p className="mt-1 text-[11px] text-[#77736b]">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="max-w-3xl space-y-5">

        <SettingsSection
          icon={User}
          title="Profile"
          description="Your account information."
        >
          <div className="grid gap-4 md:grid-cols-2">

            <SettingField
              label="Name"
              value={user?.name || "Arvind Rawat"}
            />

            <SettingField
              label="Email"
              value={
                user?.email ||
                "arvind@example.com"
              }
            />

          </div>
        </SettingsSection>

        <SettingsSection
          icon={Shield}
          title="Security"
          description="Manage authentication and security settings."
        >
          <button className="border border-[#d8d4cc] px-4 py-2 text-[10px] font-semibold hover:bg-[#ebe8e1]">
            Change Password
          </button>
        </SettingsSection>

        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Control system notifications."
        >
          <label className="flex items-center gap-3 text-[10px]">
            <input
              type="checkbox"
              defaultChecked
            />

            Receive transfer notifications
          </label>
        </SettingsSection>

      </div>

    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="border border-[#ddd9d1] bg-[#fbfaf7]">

      <div className="flex items-center gap-3 border-b border-[#ddd9d1] px-5 py-4">

        <div className="flex h-8 w-8 items-center justify-center border border-[#d8d4cc] bg-[#f1efe9]">
          <Icon size={14} />
        </div>

        <div>
          <h2 className="text-sm font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-[9px] text-[#77736b]">
            {description}
          </p>
        </div>

      </div>

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}

function SettingField({
  label,
  value,
}) {
  return (
    <div>
      <label className="form-label">
        {label}
      </label>

      <input
        value={value}
        readOnly
        className="form-input"
      />
    </div>
  );
}