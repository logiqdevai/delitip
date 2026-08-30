"use client";

import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  useAlertPreferences,
  useUpdateAlertPreference,
} from "@/features/alerts/hooks/use-alerts";
import { AlertTypeFormOptions } from "@/config/constants/dropdowns/alerts/alert-type-form.options";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

export const AlertPreferencesForm: FC = () => {
  const { storeId } = useWorkspace();
  const preferencesQuery = useAlertPreferences(storeId ?? "");
  const updatePreference = useUpdateAlertPreference(storeId ?? "");

  if (!storeId) return null;

  const preferences = preferencesQuery.data ?? [];
  const isEnabledByType = new Map(
    preferences.map((preference) => [preference.alert_type, preference.is_enabled]),
  );

  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">
          Alert preferences
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Choose which automatic alerts your team receives in the Alerts
          inbox.
        </p>
      </div>

      {preferencesQuery.isPending ? (
        <Skeleton className="h-32 w-full rounded-xl" />
      ) : (
        <div className="divide-y divide-zinc-100">
          {AlertTypeFormOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between py-2.5"
            >
              <span className="text-xs font-medium text-ink-charcoal">
                {option.label}
              </span>
              <Switch
                checked={isEnabledByType.get(option.id) ?? true}
                onCheckedChange={(checked) =>
                  updatePreference.mutate({
                    alertType: option.id,
                    isEnabled: checked,
                  })
                }
                disabled={updatePreference.isPending}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
