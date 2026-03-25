import { StyleSheet, Pressable, type PressableProps, ActivityIndicator } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/ui/themed-text';

export type ThemedButtonProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  title: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  lightTextColor,
  darkTextColor,
  variant = 'primary',
  loading = false,
  disabled,
  title,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    variant === 'primary' ? 'tint' : 'background'
  );

  const textColor = useThemeColor(
    { light: lightTextColor, dark: darkTextColor },
    variant === 'primary' ? 'background' : 'tint'
  );

  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => {
        const variantStyles = [];
        if (variant === 'primary') {
          variantStyles.push(styles.primary, { backgroundColor });
        } else if (variant === 'outline') {
          variantStyles.push(styles.outline, { borderColor: backgroundColor });
        } else if (variant === 'secondary') {
          variantStyles.push(styles.secondary);
        }

        return [
          styles.base,
          ...variantStyles,
          {
            opacity: pressed ? 0.7 : isDisabled ? 0.5 : 1,
          },
          style,
        ];
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? textColor : backgroundColor}
          accessibilityLabel="Loading"
        />
      ) : (
        <ThemedText
          style={[
            styles.text,
            {
              color: variant === 'primary' ? textColor : backgroundColor,
            },
          ]}
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    // backgroundColor will be set dynamically
  },
  secondary: {
    backgroundColor: '#ccc',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
