import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";

function MessageStatus({ isSaved }) {
  return (
    <div className="inline-flex items-center ml-2">
      {isSaved ? (
        <CheckCircle2 size={16} className="text-blue-500" />
      ) : (
        <Clock size={16} className="text-gray-400" />
      )}
    </div>
  );
}

export default MessageStatus;
