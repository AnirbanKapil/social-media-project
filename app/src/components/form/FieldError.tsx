type Props = {
  id: string;
  message?: string;
  className?: string;
};

export function FieldError({ id, message, className }: Props) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={className ?? "mx-2 mt-1 text-sm text-red-400"}
    >
      {message}
    </p>
  );
}
