import TwoPanel from "@/components/TwoPanel";

export default function Home() {
  return (
    <TwoPanel
      leftPanel={
        <>
          <h2 className="text-lg font-semibold mb-4 text-foreground">JSON Input</h2>
          <textarea
            className="code-area w-full h-48 resize-none"
            placeholder="Paste your JSON here..."
          />
          <div className="mt-4">
            <button className="btn">Parse JSON</button>
          </div>
          <div className="mt-4 text-foreground-muted">
            {/* Tree view will be rendered here */}
            <p className="text-sm italic">Tree view placeholder</p>
          </div>
        </>
      }
      rightPanel={
        <>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Jinja2 Expression Builder</h2>
          <textarea
            className="code-area w-full h-96 resize-none"
            placeholder="Click tree nodes to build expression..."
          />
          <div className="flex gap-2 mt-4">
            <button className="btn">Copy to Clipboard</button>
            <button className="btn btn-success">Test Template</button>
            <button className="btn btn-danger">Reset</button>
          </div>
          <div className="mt-4">
            <div className="code-area w-full h-48 bg-surface-elevated">
              {/* Preview output will be rendered here */}
              <p className="text-sm italic text-foreground-muted">Preview placeholder</p>
            </div>
          </div>
        </>
      }
    />
  );
}
