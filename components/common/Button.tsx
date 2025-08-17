import { Pressable, Text, PressableProps } from 'react-native';
import { cn } from 'utils/cn';

interface ButtonProps extends PressableProps {
  title: string;
  className?: string;
  textClassName?: string;
}

export default function Button({ title, className, textClassName,  ...props }: ButtonProps) {
  return (
    <Pressable
      className={cn(
        'px-4 py-2 rounded items-center',
        className
      )}
      {...props}
    >
      <Text
        className={cn(
          'text-center w-full',
          textClassName
        )}
    >{title}</Text>
    </Pressable>
  );
} 