import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ClinicalReport({ result, metadata }) {
  if (!result) return null;

  const processedMarkdown = result.explanation
    ? result.explanation
        .replace(/(\s+)?(\d+\.\s+\*\*)/g, '\n\n$2')
        .replace(/(\s+)?(\d+\.\s+[A-Za-z])/g, '\n\n$2')
        .replace(/(\s+)?(\*\s+[A-Za-z])/g, '\n$2')
    : '';

  return (
    <div className="w-full bg-white text-black font-sans box-border">
      
      {/* Report Header */}
      <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">TB Detection System</h1>
          <h2 className="text-base font-semibold text-slate-800 uppercase tracking-widest">Clinical AI Workstation</h2>
        </div>
        <div className="text-right text-sm space-y-1">
          <p><span className="font-bold">Doctor ID:</span> {metadata.doctorId}</p>
          <p><span className="font-bold">Session ID:</span> {metadata.sessionId}</p>
          <p><span className="font-bold">Date / Time:</span> {new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Patient Information (Fillable) */}
      <div className="mb-8 print-avoid-break">
        <h3 className="text-base font-bold uppercase border-b border-black pb-1 mb-4">Patient Information</h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-base">
          <div className="flex border-b border-black pb-1">
            <span className="font-semibold w-32 shrink-0">Patient Name:</span>
            <span className="flex-1"></span>
          </div>
          <div className="flex border-b border-black pb-1">
            <span className="font-semibold w-32 shrink-0">Patient ID:</span>
            <span className="flex-1"></span>
          </div>
          <div className="flex border-b border-black pb-1">
            <span className="font-semibold w-32 shrink-0">Age / Sex:</span>
            <span className="flex-1"></span>
          </div>
          <div className="flex border-b border-black pb-1">
            <span className="font-semibold w-32 shrink-0">Sample ID:</span>
            <span className="flex-1"></span>
          </div>
          <div className="flex border-b border-black pb-1">
            <span className="font-semibold w-32 shrink-0">Collection Date:</span>
            <span className="flex-1"></span>
          </div>
          <div className="flex border-b border-black pb-1">
            <span className="font-semibold w-56 shrink-0">Ref. By (Doctor ID):</span>
            <span className="flex-1 font-mono tracking-wider">{metadata.doctorId}</span>
          </div>
          <div className="col-span-2 flex border-b border-black pb-1 mt-2">
            <span className="font-semibold w-40 shrink-0">Clinical Context:</span>
            <span className="flex-1"></span>
          </div>
          <div className="col-span-2 flex border-b border-black pb-1 mt-2">
            <span className="font-semibold w-40 shrink-0">Additional Notes:</span>
            <span className="flex-1"></span>
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="mb-8 print-avoid-break">
        <h3 className="text-base font-bold uppercase border-b border-black pb-1 mb-4">Review</h3>
        <div className="text-sm leading-relaxed mb-4 border-l-2 border-black pl-4 py-1 space-y-2">
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-2" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 font-semibold space-y-1" {...props} />,
              li: ({node, ...props}) => <li className="font-normal" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold underline decoration-slate-300" {...props} />
            }}
          >
            {processedMarkdown}
          </ReactMarkdown>
        </div>
      </div>

      {/* Annotated Image */}
      <div className="mb-8 print-avoid-break flex flex-col items-center">
        <h3 className="text-base font-bold uppercase w-full border-b border-black pb-1 mb-4 text-left">Annotated Image Feed</h3>
        <div className="w-full max-w-3xl border-2 border-black p-1 flex justify-center bg-white">
          {result.annotated_image && (
             <img src={result.annotated_image.startsWith('data:image') ? result.annotated_image : `data:image/jpeg;base64,${result.annotated_image}`} alt="Annotated Subject" className="max-h-[400px] object-contain grayscale mix-blend-multiply" />
          )}
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-12 pt-8 border-t-2 border-black print-avoid-break">
        <div className="grid grid-cols-2 gap-12 mt-12 w-full max-w-2xl mx-auto">
          <div className="border-t-2 border-black pt-2">
            <span className="text-base font-bold uppercase">Reviewed By / Signature</span>
          </div>
          <div className="border-t-2 border-black pt-2">
            <span className="text-base font-bold uppercase">Date</span>
          </div>
        </div>
      </div>

    </div>
  );
}
