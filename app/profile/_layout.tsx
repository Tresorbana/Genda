import { Stack } from 'expo-router';
import colors from '@/constants/colors';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.dark.background,
        },
        headerTintColor: colors.dark.text,
        headerTitleStyle: {
          color: colors.dark.text,
        },
        contentStyle: {
          backgroundColor: colors.dark.background,
        },
      }}
    />
  );
}