import { Pressable, Text, PressableProps } from 'react-native';
import { cn } from '../utils/cn';

interface ButtonProps extends PressableProps {
  title: string;
  className?: string;
}

export default function Button({ title, className, ...props }: ButtonProps) {
  return (
    <Pressable
      className={cn(
        'px-4 py-2 bg-blue-600 rounded items-center',
        className
      )}
      {...props}
    >
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  );
} 