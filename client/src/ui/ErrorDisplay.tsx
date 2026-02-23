import { X } from "lucide-react";

interface ErrorDisplayProps {
  errors:
    | Array<{
        field: string;
        message: string;
      }>
    | string;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorDisplay({ errors, onDismiss, className = "" }: ErrorDisplayProps) {
  if (!errors) return null;

  const errorArray = Array.isArray(errors) ? errors : [{ field: "Error", message: errors }];

  return (
    <div className={`rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-950/30 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="mb-2 font-semibold text-red-800 dark:text-red-300">Please fix the following errors:</h4>
          <ul className="space-y-1">
            {errorArray.map((error, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="mt-0.5 text-red-500">-</span>
                <div>
                  <span className="font-medium">{error.field}:</span> {error.message}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-red-500 transition-colors hover:text-red-700 dark:hover:text-red-200"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
