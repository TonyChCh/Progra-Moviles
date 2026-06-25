import { Pressable, Text, StyleSheet } from 'react-native';

type AppButtonVariant = 'primary' | 'danger' | 'selected' | 'overlay';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: AppButtonVariant;
}

export function AppButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
    </Pressable>
  );
}

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: '#007AFF' },
  danger: { backgroundColor: '#FF3B30' },
  selected: { backgroundColor: '#0051A8' },
  overlay: { backgroundColor: 'rgba(0, 153, 255, 0.92)' },
});

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  disabled: {
    backgroundColor: '#C7C7CC',
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  textDisabled: {
    color: '#8E8E93',
  },
});
