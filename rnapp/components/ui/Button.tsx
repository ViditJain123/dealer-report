import { ActivityIndicator, Pressable, Text } from "react-native";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline";

const VARIANT: Record<
  ButtonVariant,
  { container: string; label: string; spinner: string }
> = {
  primary: {
    container: "bg-primary",
    label: "text-primary-foreground",
    spinner: "#fafafa",
  },
  secondary: {
    container: "bg-secondary",
    label: "text-secondary-foreground",
    spinner: "#0a0a0a",
  },
  outline: {
    container: "border border-border bg-transparent",
    label: "text-foreground",
    spinner: "#0a0a0a",
  },
};

/** Primary action button with variants and a built-in loading state. */
export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}) {
  const isDisabled = disabled || loading;
  const styles = VARIANT[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={cn(
        "h-12 flex-row items-center justify-center gap-2 rounded-md px-4",
        styles.container,
        isDisabled && "opacity-50",
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styles.spinner} />
      ) : (
        <Text className={cn("font-sans-semibold text-subheading", styles.label)}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
