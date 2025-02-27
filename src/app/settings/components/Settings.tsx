import React from "react";
import { Bell, Eye, Shield, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingsSection = ({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="border border-slate-700 rounded-lg p-6 space-y-4">
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-blue-400" />
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
    <div className="pt-4">{children}</div>
  </div>
);

const SettingRow = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
    <Switch />
  </div>
);

const SettingsPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

        <div className="space-y-6">
          <SettingsSection
            title="Notifications"
            description="Configure how you want to receive alerts and updates"
            icon={Bell}
          >
            <div className="space-y-4">
              <SettingRow
                title="Push Notifications"
                description="Receive notifications when reports are ready"
              />
              <SettingRow
                title="Email Notifications"
                description="Get updates sent to your email"
              />
              <SettingRow
                title="Property Alerts"
                description="Get notified about property status changes"
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Display"
            description="Customize how information is displayed"
            icon={Eye}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Theme</p>
                  <p className="text-sm text-gray-400">
                    Choose your preferred theme
                  </p>
                </div>
                <Select defaultValue="dark">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <SettingRow
                title="Compact View"
                description="Show more data in less space"
              />
              <SettingRow
                title="Advanced Charts"
                description="Enable detailed interactive charts"
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Data Preferences"
            description="Manage how data is processed and displayed"
            icon={Database}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    Default Date Range
                  </p>
                  <p className="text-sm text-gray-400">
                    Set default time period for reports
                  </p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <SettingRow
                title="Auto-refresh Dashboard"
                description="Keep dashboard data up to date"
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Security"
            description="Manage your account security settings"
            icon={Shield}
          >
            <div className="space-y-4">
              <SettingRow
                title="Two-factor Authentication"
                description="Add an extra layer of security"
              />
              <SettingRow
                title="Login Notifications"
                description="Get notified of new login attempts"
              />
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
