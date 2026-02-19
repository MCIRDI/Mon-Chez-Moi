import { X } from "lucide-react";

interface ErrorDisplayProps {
  errors: Array<{
    field: string;
    message: string;
  }> | string;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorDisplay({ errors, onDismiss, className = "" }: ErrorDisplayProps) {
  if (!errors) return null;

  const errorArray = Array.isArray(errors) ? errors : [{ field: "Error", message: errors }];

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
          <ul className="space-y-1">
            {errorArray.map((error, index) => (
              <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
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
            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
