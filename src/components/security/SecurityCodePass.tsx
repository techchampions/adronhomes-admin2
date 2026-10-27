import { useEffect, useState } from "react";
import { createVisitorPassDataUrl } from "./visitorPass";

interface SecurityCodePassProps {
  code: string;
  name?: string;
  estateName?: string;
}

export default function SecurityCodePass({
  code,
  name,
  estateName,
}: SecurityCodePassProps) {
  const [passUrl, setPassUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPassUrl(null);
    createVisitorPassDataUrl({ code, name, estateName })
      .then((url) => {
        if (!cancelled) setPassUrl(url);
      })
      .catch(() => {
        if (!cancelled) setPassUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [code, name, estateName]);

  const download = () => {
    if (!passUrl) return;
    const link = document.createElement("a");
    link.href = passUrl;
    link.download = `visitor-pass-${code || "security-code"}.png`;
    link.click();
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-[92px] w-[58px] overflow-hidden rounded-md bg-[#F7F7F7]">
          {passUrl ? (
            <img
              src={passUrl}
              alt={`Visitor pass for ${code}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-[#F3F3F3]" />
          )}
        </div>
        <div className="flex flex-col items-start gap-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={!passUrl}
            className="text-xs font-medium text-[#209dd7] disabled:text-[#b5b5b5]"
          >
            View
          </button>
          <button
            type="button"
            onClick={download}
            disabled={!passUrl}
            className="text-xs font-medium text-[#753991] disabled:text-[#b5b5b5]"
          >
            Download
          </button>
        </div>
      </div>

      {open && passUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-[360px] flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={passUrl}
              alt={`Visitor pass for ${code}`}
              className="max-h-[72vh] w-auto rounded-[22px] shadow-2xl"
            />
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={download}
                className="h-11 rounded-full bg-[#272727] px-5 text-sm font-medium text-white"
              >
                Download
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 rounded-full border border-white/40 px-5 text-sm font-medium text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
