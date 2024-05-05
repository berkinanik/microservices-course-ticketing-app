import { cn } from '~/utils';

export const Button: React.FC<React.ComponentProps<'button'>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        'cursor-pointer rounded-md border border-black px-2 py-1 transition-colors hover:bg-slate-100 active:bg-slate-200',
        {
          'cursor-not-allowed bg-slate-200 hover:bg-slate-200': props.disabled,
        },
        className,
      )}
    >
      {children}
    </button>
  );
};
